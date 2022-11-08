import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { IProvidersProps } from "../../providers";
import api from "../../services/api/api";
import { IGetTrainerInfoResponse } from "../../services/api/trainer/interfaces";
import {
  getCheckInStudents,
  getTrainerInfo,
} from "../../services/api/trainer/requests";

export interface IUserContextData {
  checkinSchedule: ICheckinData;
  setCheckinSchedule: Dispatch<SetStateAction<ICheckinData>>;
  isTrainer: boolean;
  setIsTrainer: Dispatch<SetStateAction<boolean>>;
  isDisable: {
    checkin: boolean;
    checkout: boolean;
  };
  setIsDisable: Dispatch<
    SetStateAction<{
      checkin: boolean;
      checkout: boolean;
    }>
  >;
  checkinVerification: (difference: number) => void;
  checkoutVerification: (day: number, month: number, year: number) => void;
  userInfo: IGetTrainerInfoResponse[];
  setUserInfo: Dispatch<SetStateAction<IGetTrainerInfoResponse[]>>;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  editUserInfo: (data: IEditTrainerInfoProps) => Promise<void>;
  userAvatar: string | undefined;
  setUserAvatar: Dispatch<SetStateAction<string | undefined>>;
  getUserInfo: () => Promise<void>;
}

export interface ICheckinData {
  start: string;
  end: string;
}

export const UserContext = createContext<IUserContextData>(
  {} as IUserContextData
);

export interface IEditTrainerInfoProps {
  name?: string;
  oldEmail?: string;
  email?: string;
  confirmNewEmail?: string;
  avatar?: any;
}

const UserProviders = ({ children }: IProvidersProps) => {
  const [checkinSchedule, setCheckinSchedule] = useState<ICheckinData>(
    {} as ICheckinData
  );
  const [isTrainer, setIsTrainer] = useState(false);
  const [isDisable, setIsDisable] = useState({
    checkin: true,
    checkout: true,
  });
  const [userInfo, setUserInfo] = useState<IGetTrainerInfoResponse[]>([]);
  const toleranceMin = 20;
  const [showModal, setShowModal] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);

  const checkinVerification = (difference: number) => {
    if (difference < toleranceMin) {
      setIsDisable({ ...isDisable, checkin: false });
    }
  };

  const checkoutVerification = async (
    day: number,
    month: number,
    year: number
  ) => {
    const userId = localStorage.getItem("@userId:SistemaDePontos") || "";
    const token = localStorage.getItem("@token:SistemaDePontos");
    api.defaults.headers.authorization = `Bearer ${token}`;
    const checkout = await getCheckInStudents(+userId, day, month, year);
    checkout.length > 1
      ? setIsDisable({ checkin: true, checkout: true })
      : setIsDisable({ checkin: true, checkout: false });
  };

  const getUserInfo = async () => {
    const token = localStorage.getItem("@token:SistemaDePontos");

    const userId = Number(localStorage.getItem("@userId:SistemaDePontos"));
    api.defaults.headers.authorization = `Bearer ${token}`;

    if (userId) {
      const info = await getTrainerInfo(userId);
      setUserInfo(info);
      setUserAvatar(info[0].avatar);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const editUserInfo = async (data: IEditTrainerInfoProps) => {
    try {
      const userId = localStorage.getItem("@userId:SistemaDePontos");
      api.patch(`/users/${userId}`, data);
      toast.success("Alteração feita com sucesso");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        checkinSchedule,
        setCheckinSchedule,
        isTrainer,
        setIsTrainer,
        isDisable,
        setIsDisable,
        checkinVerification,
        checkoutVerification,
        userInfo,
        setUserInfo,
        showModal,
        setShowModal,
        editUserInfo,
        userAvatar,
        setUserAvatar,
        getUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProviders;
