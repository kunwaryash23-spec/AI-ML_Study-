"""
Day 25 · Shared knowledge base — YOUR OWN COURSE NOTES
Today's documents are the notes from this very course. We'll build a system
that can answer questions about them.
    from course_notes import NOTES
    NOTES is a list of (title, text) pairs.
Needs:  nothing (pure Python)
"""

NOTES = [
    ("Train/test split",
     "We always hold back part of the data as a test set. The model never sees it during "
     "training, so its score on the test set is an honest estimate of how it will do on new "
     "data. A typical split is 75 percent for training and 25 percent for testing."),

    ("Overfitting",
     "Overfitting is when a model memorises the training rows instead of learning the pattern. "
     "The sign is a large gap between train accuracy and test accuracy, for example train 1.000 "
     "but test 0.771. A model that is perfect on training data but weak on new data has memorised, "
     "not learned."),

    ("Cross-validation",
     "Cross-validation splits the data into k folds, trains on k minus one of them and tests on "
     "the held-out fold, then rotates and averages. It gives a steadier, more honest score than a "
     "single split, reported as mean plus or minus standard deviation."),

    ("Data leakage",
     "Leakage happens when information from the test set sneaks into training, for example fitting "
     "a scaler on all the data before splitting. The fix is to put every transformer inside a "
     "Pipeline so it is fitted on the training fold only."),

    ("Decision tree",
     "A decision tree asks a series of yes or no questions about one feature at a time, such as "
     "is worst radius less than seventeen. It chooses each question by measuring Gini impurity and "
     "keeping the split that makes the child groups purest. Its strength is that you can read it."),

    ("Gini impurity",
     "Gini impurity measures how mixed a group is. The formula is one minus the sum of squared "
     "class fractions. Zero means the group is pure, all one class, while zero point five means an "
     "even fifty fifty mix. A tree picks the split that most reduces impurity."),

    ("Random forest",
     "A random forest grows many decision trees, each on a random sample of rows and features, "
     "then lets them vote. Because the trees make different mistakes, the errors cancel out and "
     "the forest generalises better than any single tree. This trick is called bagging."),

    ("Feature importance",
     "Feature importance ranks how much each column contributed to a tree model's decisions, by "
     "totalling the impurity reduction from every split that used it. It turns a model into a "
     "story you can tell, for example distance and preparation time drove most predictions."),

    ("k-means clustering",
     "k-means is unsupervised, meaning it has no labels. It places k centres at random, assigns "
     "every point to its nearest centre, moves each centre to the average of its points, and "
     "repeats until nothing moves. It minimises inertia, the total squared distance to centres."),

    ("Choosing k",
     "To choose the number of clusters, use the elbow method, where you plot inertia against k and "
     "look for the bend, and the silhouette score, which rates how cleanly separated the clusters "
     "are from minus one to plus one. When they disagree, you decide using domain knowledge."),

    ("Feature engineering",
     "Feature engineering means creating better input columns, such as ratios, differences or date "
     "parts. A model can only use what you give it. Adding one good column can help far more than "
     "switching to a fancier model."),

    ("Scaling",
     "Standard scaling rewrites each value as z equals x minus the mean divided by the standard "
     "deviation. Distance-based models such as logistic regression, k-means and neural networks "
     "need it, because otherwise a large-valued column dominates. Trees and forests do not need it."),

    ("One-hot encoding",
     "One-hot encoding turns a text column into one zero-or-one column per category. You must not "
     "simply number the categories one, two, three, because that invents a false ordering that the "
     "model would wrongly trust."),

    ("The neuron",
     "A neuron does two steps. First a weighted sum of its inputs plus a bias, and then an "
     "activation function that bends the result. A single neuron with a sigmoid activation is "
     "exactly logistic regression."),

    ("Activation functions",
     "An activation adds a bend so a network can do more than draw a straight line. Sigmoid "
     "squashes any number into zero to one and suits a final probability. ReLU is max of zero and "
     "x, and is the usual choice inside hidden layers."),

    ("Neural network layers",
     "A network stacks neurons into layers: an input layer, one or more hidden layers, and an "
     "output layer. Hidden layers build their own features from the raw inputs, which is why a "
     "network can learn a curved boundary that a straight line cannot."),

    ("Training a network",
     "Training repeats four steps: a forward pass to get a prediction, a loss to measure how wrong "
     "it is, backpropagation to find which weights caused the error, and gradient descent to nudge "
     "each weight a small step downhill. Repeat thousands of times."),

    ("Learning rate",
     "The learning rate is the step size in gradient descent, written new weight equals old weight "
     "minus rate times slope. Too small and training crawls and never arrives. Too big and it "
     "overshoots and the loss bounces instead of falling."),

    ("Early stopping",
     "Early stopping holds out a small validation slice during training and halts when that score "
     "stops improving. It prevents the network from carrying on into memorisation, shrinking the "
     "train-test gap and saving a lot of training time."),

    ("Bag of words",
     "Bag of words turns text into numbers by giving each vocabulary word a column and counting "
     "occurrences. It works surprisingly well, but it throws away word order, so the phrase not "
     "good looks almost identical to good."),

    ("TF-IDF",
     "TF-IDF weights each word by how often it appears in a document times how rare it is across "
     "all documents. Common words such as the get crushed toward zero because they carry little "
     "meaning, while distinctive words get boosted."),

    ("Embeddings",
     "An embedding represents a word or document as a short list of numbers, positioned so that "
     "similar meanings sit close together. Unlike bag of words, it captures that good and great are "
     "related. Relationships become arithmetic, for example king minus man plus woman equals queen."),

    ("Cosine similarity",
     "Cosine similarity compares the direction of two vectors, computed as their dot product "
     "divided by both their lengths. One means the same meaning, zero means unrelated. We use "
     "direction rather than distance so document length does not matter."),

    ("Semantic search",
     "Semantic search embeds every document once, embeds the incoming query the same way, scores "
     "each document by cosine similarity, and returns the highest scoring ones. It finds matches by "
     "meaning rather than by exact keyword."),
]


if __name__ == "__main__":
    print(f"{len(NOTES)} course notes in the knowledge base")
    for title, _ in NOTES[:5]:
        print(" -", title)