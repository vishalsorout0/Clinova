import { usePatientContext } from "../context/PatientContext";


export function usePatient() {
  return usePatientContext();
}

export default usePatient;