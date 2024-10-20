from transformers import AutoModelForCausalLM, AutoTokenizer

_model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.2-3B", torch_dtype="auto", device_map="auto"
)
_tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B")
