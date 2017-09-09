import { fromJS } from 'immutable';

const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false
  }
});

export default function appReducer(state = initialState, action: any) {
  switch (action.type) {
    // Actions
    default:
      return state;
  }
}
