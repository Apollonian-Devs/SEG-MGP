import numpy as np
import hdbscan
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_distances



"""
sentences = [
        "I lost my student ID",
        "Where can I find info about losing my student ID",
        "I can't get issued a new student ID",
        "No one is responding to my email",
        "I have contacted the officers, but haven't received a response for the past 2 days",
        "The weather is nice today",
        "It's raining heavily outside",
        "I need help with my course enrollment",
        "How do I enroll in a new course?",
        "The lecture schedule has changed",
        "What are the library hours?",
        "Can I borrow a book from the university library?"
    ]

"""
def MessageGroupAI(sentences):
    if len(sentences) < 2:
        raise ValueError(f"Clustering error: Invalid input: Need at least 2 sentences, got {len(sentences)}.")

    model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = model.encode(sentences)
    
    # Compute cosine distances and convert to float64
    distance_matrix = cosine_distances(embeddings).astype(np.float64)

    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=2,  
        min_samples=1,       
        metric='precomputed',
        cluster_selection_method='eom',
        cluster_selection_epsilon=0.001 
    )

    clusters = clusterer.fit_predict(distance_matrix)
    probabilities = clusterer.probabilities_

    print(f"🔍 DEBUG: Clusters assigned: {clusters}")
    print(f"🔍 DEBUG: Probabilities: {probabilities}")

    return clusters, probabilities
