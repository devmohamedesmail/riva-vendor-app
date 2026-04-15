import { useContext } from "react";
import { UpdateContext } from "@/context/update-provider";


export default function useUpdate() {
    const context = useContext(UpdateContext);
    if (!context) {
        throw new Error('useUpdate must be used within UpdateProvider')
    }
    return context
}
