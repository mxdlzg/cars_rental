// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
//
// const persistConfig = {
//     timeout: 1000,  // you can define your time. But is required.
//     key: 'root',
//     storage,
//     //whitelist: ['xxx'],
//     stateReconciler:autoMergeLevel2
// };
// const persistEnhancer = () => createStore => (reducer, initialState, enhancer) => {
//     const store = createStore(persistReducer(persistConfig, reducer), initialState, enhancer);
//     const persist = persistStore(store, null);
//     return {
//         persist,
//         ...store,
//     };
// };

export const dva = {
    config: {
        //extraEnhancers:[persistEnhancer()],
        onError(e) {
            e.preventDefault();
            console.error(e.message);
        },
    },
    plugins: [
        require('dva-logger')(),
    ],
};
