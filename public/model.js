class NeuralNetwork {
    constructor(inp, hid, out, d) {
        if (inp instanceof tf.Sequential) {
            this.model = inp;
            this.input_nodes = hid;
            this.hidden_nodes = out;
            this.output_nodes = d;
        } else {
            this.input_nodes = inp;
            this.hidden_nodes = hid;
            this.output_nodes = out;
            this.model = this.createModel();
        }
    }

    dispose() {
        this.model.dispose();//descarta o modelo
    }

    async save(score) {//faz download do modelo
        const saveResult = await this.model.save('downloads://Best-model'+score);
    }

    async load() {//roda o melhor modelo
        const model = await tf.loadLayersModel('http://localhost:3000/model/Best-model289.json');
        this.model = model
    } 

    createModel() {
        const model = tf.sequential();
        model.add(tf.layers.dense({
            units: this.hidden_nodes,
            inputShape: [this.input_nodes],
            activation: 'relu'
        }));
        model.add(tf.layers.dense({
            units: this.output_nodes,
            activation: 'softmax'
        }));
        return model;
    }

    predict(inputs) {
        return tf.tidy(() => {
            const inps = tf.tensor2d([inputs]);
            const ops = this.model.predict(inps);
            return ops.dataSync();
        });
    }

    copy() {
        return tf.tidy(() => {
            const modelCopy = this.createModel();
            const weights = this.model.getWeights();
            const weightCopies = weights.map(weight => weight.clone());
            modelCopy.setWeights(weightCopies);
            return new NeuralNetwork(modelCopy, this.input_nodes, this.hidden_nodes, this.output_nodes);
        });
    }

    mutate(mutationRate) {
        tf.tidy(() => {
            const weights = this.model.getWeights();//pega os pesos do modeleo
            const mutatedWeights = weights.map(tensor => {//mutação do pesos
                const shape = tensor.shape;//forma do modelo, entradas, saídas, camada oculta

                //faz um loop pelos pesos do modelo gerando um valor aleatório, e se esse valor aleatório for maior que a taxa de mutação
                //o peso é alterado
                const values = tensor.dataSync().map(value => (Math.random() < mutationRate) ? value + randomGaussian() : value);
                //rertonrna o tensor com pesos modificados
                return tf.tensor(values, shape);
            });
            //atualiza os pesos
            this.model.setWeights(mutatedWeights);
        });
    }
}
