自定义 NAS 算法
=========================

扩展 One-Shot Trainer
---------------------------------------

如果要在真实任务上使用 Trainer，还需要更多操作，如分布式训练，低精度训练，周期日志，写入 TensorBoard，保存检查点等等。 如前所述，一些 Trainer 支持了上述某些功能。 有两种方法可往已有的 Trainer 中加入功能：继承已有 Trainer 并重载，或复制已有 Trainer 并修改。

无论哪种方法，都需要实现新的 Trainer。 基本上，除了新的 Mutator 的概念，实现 One-Shot Trainer 与普通的深度学习 Trainer 相同。 因此，有两处会有所不同：


* 初始化

.. code-block:: python

   model = Model()
   mutator = MyMutator(model)


* Training

.. code-block:: python

   for _ in range(epochs):
       for x, y in data_loader:
           mutator.reset()  # reset all the choices in model
           out = model(x)  # like traditional model
           loss = criterion(out, y)
           loss.backward()
           # no difference below

要展示 Mutator 的用途，需要先了解 One-Shot NAS 的工作原理。 通常 One-Shot NAS 会同时优化模型权重和架构权重。 它会反复的：对架构采样，或由超网络中的几种架构组成，然后像普通深度学习模型一样训练，将训练后的参数更新到超网络中，然后用指标或损失作为信号来指导架构的采样。 Mutator，在这里用作架构采样，通常会是另一个深度学习模型。 因此，可将其看作一个通过定义参数，并使用优化器进行优化的任何模型。 Mutator 是由一个模型来初始化的。 一旦 Mutator 绑定到了某个模型，就不能重新绑定到另一个模型上。

``mutator.reset()`` is the core step. 这一步确定了模型最终的所有 Choice。 重置的结果会一直有效，直到下一次重置来刷新数据。 重置后，模型可看作是普通的模型来进行前向和反向传播。

Finally, mutators provide a method called ``mutator.export()`` that export a dict with architectures to the model. 注意，当前 dict 是从 Mutable 键值到选择张量的映射。 为了存储到 JSON，用户需要将张量显式的转换为 Python 的 list。

同时，NNI 提供了工具，能更容易地实现 Trainer。 See `Trainers <./NasReference.rst>`__ for details.

Implement New Mutators
----------------------

To start with, here is the pseudo-code that demonstrates what happens on ``mutator.reset()`` and ``mutator.export()``.

.. code-block:: python

   def reset(self):
       self.apply_on_model(self.sample_search())

.. code-block:: python

   def export(self):
       return self.sample_final()

On reset, a new architecture is sampled with ``sample_search()`` and applied on the model. 然后，对模型进行一步或多步的搜索。 On export, a new architecture is sampled with ``sample_final()`` and **do nothing to the model**. This is either for checkpoint or exporting the final architecture.

The requirements of return values of ``sample_search()`` and ``sample_final()`` are the same: a mapping from mutable keys to tensors. The tensor can be either a BoolTensor (true for selected, false for negative), or a FloatTensor which applies weight on each candidate. The selected branches will then be computed (in ``LayerChoice``\ , modules will be called; in ``InputChoice``\ , it's just tensors themselves), and reduce with the reduction operation specified in the choices. For most algorithms only worrying about the former part, here is an example of your mutator implementation.

.. code-block:: python

   class RandomMutator(Mutator):
       def __init__(self, model):
           super().__init__(model)  # don't forget to call super
           # do something else

       def sample_search(self):
           result = dict()
           for mutable in self.mutables:  # this is all the mutable modules in user model
               # mutables share the same key will be de-duplicated
               if isinstance(mutable, LayerChoice):
                   # decided that this mutable should choose `gen_index`
                   gen_index = np.random.randint(mutable.length)
                   result[mutable.key] = torch.tensor([i == gen_index for i in range(mutable.length)], 
                                                      dtype=torch.bool)
               elif isinstance(mutable, InputChoice):
                   if mutable.n_chosen is None:  # n_chosen is None, then choose any number
                       result[mutable.key] = torch.randint(high=2, size=(mutable.n_candidates,)).view(-1).bool()
                   # else do something else
           return result

       def sample_final(self):
           return self.sample_search()  # use the same logic here. you can do something different

The complete example of random mutator can be found :githublink:`here <src/sdk/pynni/nni/nas/pytorch/random/mutator.py>`.

For advanced usages, e.g., users want to manipulate the way modules in ``LayerChoice`` are executed, they can inherit ``BaseMutator``\ , and overwrite ``on_forward_layer_choice`` and ``on_forward_input_choice``\ , which are the callback implementation of ``LayerChoice`` and ``InputChoice`` respectively. Users can still use property ``mutables`` to get all ``LayerChoice`` and ``InputChoice`` in the model code. For details, please refer to :githublink:`reference <src/sdk/pynni/nni/nas/pytorch>` here to learn more.

.. tip::
    A useful application of random mutator is for debugging. Use

    .. code-block:: python

        mutator = RandomMutator(model)
        mutator.reset()

    will immediately set one possible candidate in the search space as the active one.

Implemented a Distributed NAS Tuner
-----------------------------------

Before learning how to write a distributed NAS tuner, users should first learn how to write a general tuner. read `Customize Tuner <../Tuner/CustomizeTuner.rst>`__ for tutorials.

When users call "\ `nnictl ss_gen <../Tutorial/Nnictl.rst>`__\ " to generate search space file, a search space file like this will be generated:

.. code-block:: json

   {
       "key_name": {
           "_type": "layer_choice",
           "_value": ["op1_repr", "op2_repr", "op3_repr"]
       },
       "key_name": {
           "_type": "input_choice",
           "_value": {
               "candidates": ["in1_key", "in2_key", "in3_key"],
               "n_chosen": 1
           }
       }
   }

This is the exact search space tuners will receive in ``update_search_space``. It's then tuners' responsibility to interpret the search space and generate new candidates in ``generate_parameters``. A valid "parameters" will be in the following format:

.. code-block:: json

   {
       "key_name": {
           "_value": "op1_repr",
           "_idx": 0
       },
       "key_name": {
           "_value": ["in2_key"],
           "_idex": [1]
       }
   }

Send it through ``generate_parameters``\ , and the tuner would look like any HPO tuner. Refer to `SPOS <./SPOS.rst>`__ example code for an example.
