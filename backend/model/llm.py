import numpy as np
import torch.cuda
from transformers import AutoTokenizer, AutoModelForCausalLM


class mock_model:
    def __init__(self):
        self.hidden_states = [torch.tensor(np.load("backend/database/one-element.npy"))]

    def __call__(self, *args, **kwargs):
        return self

_model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.2-3B",
    torch_dtype="auto",
    device_map="cuda"
) if torch.cuda.is_available() else mock_model()
_tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B")
