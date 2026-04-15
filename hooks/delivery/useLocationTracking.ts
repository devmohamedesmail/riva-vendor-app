import { useEffect } from "react";
import { startLocationTracking } from "@/services/locationService";

export default function useLocationTracking() {

  useEffect(() => {
    startLocationTracking();
  }, []);

}