import { combineReducers } from 'redux';
import auth from './auth';
import shop from './shop'

export default combineReducers({
    auth,   ///this was like this auth: auth
    shop
});
