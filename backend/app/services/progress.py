def update_progress(state, agent_name, status):
    state["progress"][agent_name] = status
    return state