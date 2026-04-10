import { createContext, useContext, useState } from "react";



type UpdateContextType = {
  visible: boolean;
  showUpdate: () => void;
  hideUpdate: () => void;
};
export const UpdateContext = createContext<UpdateContextType | null>(null);

export function UpdateProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  const showUpdate = () => setVisible(true);
  const hideUpdate = () => setVisible(false);

  return (
    <UpdateContext.Provider value={{ visible, showUpdate, hideUpdate }}>
      {children}
    </UpdateContext.Provider>
  );
}

// export const useUpdateContext = () => useContext(UpdateContext);