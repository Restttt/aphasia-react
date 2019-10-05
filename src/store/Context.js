import React, { useState, useContext } from 'react';

const Context = React.createContext([{}, () => {}]);

const Provider = (props) => {
  const [state, setState] = useState({
    loggedIn: false,
    error: false,
    file: false,
    loading: false,
    response: false,
  });
  return (
    <Context.Provider value={[state, setState]}>
      {props.children}
    </Context.Provider>
  );
}

export const useStore = () => useContext(Context);

export function withProvider(Component) {
  return function WrapperComponent(props) {
    return (
      <Provider>
        <Component {...props} />
      </Provider>
    );
  };
}

export { Context, Provider };
