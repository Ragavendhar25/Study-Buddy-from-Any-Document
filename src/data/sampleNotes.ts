export interface SampleNote {
  id: string;
  title: string;
  subject: string;
  icon: string;
  preview: string;
  content: string;
}

export const SAMPLE_NOTES: SampleNote[] = [
  {
    id: 'bio-photosynthesis',
    title: 'Photosynthesis & Cellular Respiration',
    subject: 'Biology',
    icon: '🌱',
    preview: 'Light-dependent reactions, Calvin cycle, ATP synthesis, and cellular metabolism.',
    content: `Photosynthesis and Cellular Respiration: Energy Flow in Living Systems

1. Overview of Photosynthesis:
Photosynthesis is the biochemical process by which autotrophs convert light energy into chemical energy stored in glucose. The overall balanced chemical equation is:
6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2.
It occurs inside chloroplasts and consists of two primary stages: the light-dependent reactions occurring in the thylakoid membranes and the Calvin cycle (light-independent reactions) in the stroma.

2. The Light-Dependent Reactions:
Photons strike chlorophyll molecules within photosystem II (PSII), exciting electrons to higher energy states. Photolysis of water molecules replenishes these electrons, releasing molecular oxygen (O2) and protons (H+) into the thylakoid lumen. As electrons move down an electron transport chain (ETC) to photosystem I (PSI), a proton gradient is established. Protons pass down their electrochemical gradient through ATP synthase via chemiosmosis, generating ATP from ADP and inorganic phosphate. Meanwhile, ferredoxin transfers electrons to NADP+ reductase, forming NADPH.

3. The Calvin Cycle (Light-Independent Reactions):
The Calvin cycle incorporates carbon dioxide into organic molecules via carbon fixation. The enzyme Ribulose-1,5-bisphosphate carboxylase-oxygenase (RuBisCO) catalyzes the fixation of CO2 onto ribulose 1,5-bisphosphate (RuBP), yielding 3-phosphoglycerate (3-PGA). Utilizing ATP and NADPH produced in the light reactions, 3-PGA is reduced to glyceraldehyde 3-phosphate (G3P). For every three turns of the cycle, one G3P molecule exits to synthesize glucose and other carbohydrates, while remaining G3P molecules regenerate RuBP through ATP consumption.

4. Cellular Respiration:
Heterotrophs and autotrophs break down organic compounds through cellular respiration to produce adenosine triphosphate (ATP). The equation is:
C6H12O6 + 6O2 -> 6CO2 + 6H2O + ~30-32 ATP.
The pathway proceeds in four distinct stages: Glycolysis (in the cytoplasm), Pyruvate Oxidation (in the mitochondrial matrix), the Citric Acid (Krebs) Cycle (in the matrix), and Oxidative Phosphorylation (along the inner mitochondrial cristae).

5. Aerobic vs. Anaerobic Pathways:
In the presence of oxygen (aerobic), the electron transport chain uses O2 as the terminal electron acceptor, producing water. In the absence of oxygen (anaerobic), glycolysis continues via fermentation (lactic acid fermentation in animal muscle tissue, or ethanolic fermentation in yeast), producing only 2 ATP net per glucose molecule by recycling NAD+.

6. Key Connections:
Photosynthesis and respiration form an intertwined energetic cycle on Earth. The products of photosynthesis (glucose and O2) serve as the essential reactants for cellular respiration, while the byproducts of respiration (CO2 and H2O) are the substrates for photosynthesis.`,
  },
  {
    id: 'history-scientific-rev',
    title: 'The Scientific Revolution & Enlightenment',
    subject: 'World History',
    icon: '🔭',
    preview: 'Heliocentrism, empirical method, Bacon, Newton, Locke, and the transformation of modern thought.',
    content: `The Scientific Revolution and the European Enlightenment (1543 - 1789)

1. The Roots of Transformation:
From the mid-16th century through the late 18th century, Europe experienced a seismic shift in how humans investigated nature and society. The publication of Nicolaus Copernicus's "De revolutionibus orbium coelestium" in 1543 challenged the long-held geocentric model of Ptolemy and Aristotle, proposing instead a heliocentric system where Earth and the planets orbit the Sun.

2. Empirical Observation and the Scientific Method:
Francis Bacon championed inductive reasoning and empiricism—the principle that knowledge must be derived from systematic observation and controlled experimentation rather than scholastic tradition or pure deduction. Simultaneously, René Descartes formulated deductive rationalism, immortalized in "Cogito, ergo sum" ("I think, therefore I am"), establishing skepticism as the foundation for mathematical inquiry.

3. Astronomy and Mechanics:
Johannes Kepler discovered that planetary orbits are elliptical rather than circular, formulating three mathematical laws of planetary motion. Galileo Galilei used an improved telescope to observe Jupiter's moons, the phases of Venus, and sunspots, delivering observational proof that destroyed classical celestial cosmology. Despite ecclesiastical inquisition and house arrest, Galileo's kinematic experiments laid the groundwork for classical mechanics.

4. The Newtonian Synthesis:
In 1687, Sir Isaac Newton published the "Philosophiae Naturalis Principia Mathematica", uniting terrestrial and celestial physics under universal gravitation and three laws of motion. Newton demonstrated that nature operates according to uniform, mathematically predictable natural laws, fostering the Enlightenment concept of the "clockwork universe."

5. The Enlightenment and Social Philosophy:
Thinkers, known as philosophes, applied Newtonian scientific methods to human society, governance, and economics:
- John Locke rejected innate ideas, arguing humans begin as a blank slate ("tabula rasa") and possess natural rights to life, liberty, and property. Governments exist via social contract to protect these rights.
- Baron de Montesquieu advocated the separation of executive, legislative, and judicial powers to prevent tyranny.
- Voltaire championed freedom of speech, religious tolerance, and civil liberties while fiercely criticizing institutional dogma.
- Jean-Jacques Rousseau argued for popular sovereignty and the "general will" in "The Social Contract."

6. Lasting Impact:
These revolutionary scientific paradigms and democratic political philosophies catalyzed the American and French Revolutions, inspired modern constitutionalism, and birthed the modern era of technological and institutional innovation.`,
  },
  {
    id: 'cs-neural-networks',
    title: 'Deep Learning & Neural Networks',
    subject: 'Computer Science',
    icon: '🧠',
    preview: 'Perceptrons, backpropagation, activation functions, loss optimization, and transformers.',
    content: `Foundations of Artificial Neural Networks and Deep Learning

1. Introduction to Artificial Neural Networks:
Artificial Neural Networks (ANNs) are computational models inspired by biological neural circuits in the brain. They consist of layers of interconnected nodes (neurons): an input layer that receives raw features, one or more hidden layers that extract abstract representations, and an output layer that produces predictions or classifications.

2. The Artificial Neuron (Perceptron):
Each artificial neuron receives inputs (x_i), multiplies each by a learnable weight (w_i), sums these weighted inputs together with a bias term (b), and passes the result (z = sum(w_i * x_i) + b) through a non-linear activation function. Without non-linear activation functions, any deep network would collapse into an equivalent single-layer linear regression model.

3. Common Activation Functions:
- Sigmoid: Maps real-valued numbers into the range (0, 1). Historically popular, but suffers from vanishing gradients during backpropagation for large magnitude inputs.
- Tanh: Zero-centered with outputs in (-1, 1), often used in recurrent units.
- ReLU (Rectified Linear Unit): f(x) = max(0, x). The modern workhorse due to computational efficiency and resistance to vanishing gradients in the positive domain.
- Leaky ReLU and GeLU: Address the "dying ReLU" problem where neurons become permanently inactive.

4. Forward Propagation and Loss Functions:
In forward propagation, data cascades through the network layer by layer to compute predicted probabilities or continuous values (y_hat). A loss function evaluates the discrepancy between predictions and ground-truth labels (y):
- Mean Squared Error (MSE): Typically utilized for regression tasks.
- Categorical Cross-Entropy: Standard for multi-class classification, measuring information divergence between predicted probability distributions and one-hot true labels.

5. Backpropagation and Gradient Descent:
Learning in neural networks relies on computing the partial derivative of the loss function with respect to every weight and bias using the chain rule of calculus—an algorithm known as backpropagation. Optimization algorithms such as Stochastic Gradient Descent (SGD), Momentum, and Adam (Adaptive Moment Estimation) update parameters iteratively in the negative direction of the gradient to minimize total loss.

6. Regularization and Architecture Paradigms:
To prevent overfitting on training data, practitioners employ regularization techniques such as Dropout (randomly deactivating neurons during training), L1/L2 weight decay, and Batch Normalization. Contemporary architectures include Convolutional Neural Networks (CNNs) for spatial computer vision, Recurrent Neural Networks (RNNs/LSTMs) for sequential temporal data, and Transformer architectures using self-attention mechanisms for modern natural language processing and multimodal foundation models.`,
  },
];
