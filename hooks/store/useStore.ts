// import { useProfile } from './useProfile';
// export const useStore = () =>{
//     const { profile ,loading, refetch}:any = useProfile()
//     const store = profile?.store;  
//     return { store,loading,refetch };
// }


import { StoreContext } from "@/context/store-provider";
import { useContext } from "react";


export const useStore = () => {
  const context = useContext(StoreContext);
  
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return context;
};