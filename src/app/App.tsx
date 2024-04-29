import { CalendarScreen } from "./CalendarScreen";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getToday } from "./dateFunctions";
import { useEffect, useState } from "react";
import { IUser, getUserEndpoint, signOutEndpoint } from "./backend";
import { LoginScreen } from "./components/LoginScreen";
import { authContext } from "./authContext";

function App() {
  const mesAtual = getToday().substring(0, 7);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUserEndpoint().then(setUser, () => setUser(null));
  }, [])

  function signOut(){
    setUser(null)
    signOutEndpoint();
  }

  if(user){
    return (
      <authContext.Provider value={{user, signOut}}>
          <BrowserRouter>
            <Routes>
              <Route path="/calendar/:month" element={<CalendarScreen />} />
              <Route
                path="*"
                element={<Navigate replace to={{ pathname: "/calendar/" + mesAtual }} />}
              />
            </Routes>
          </BrowserRouter>
      </authContext.Provider>
    );
  }else {
    return <LoginScreen onSignIn={setUser} />
  }


}

export default App;