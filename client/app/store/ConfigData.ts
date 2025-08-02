import { create } from 'zustand';

export interface ConfigState {
  config: null | ConfigData;
  setConfig: (config: ConfigData) => void;
}

export interface ConfigData {
  haveAuth: boolean;
  cart?: {
    hasPaymentMethod: boolean;
    redirectToWsp: boolean;
    hasApplyCoupon: boolean;
  };
  shipping?: {
    enabled: boolean;
    hasFreeShipping: boolean;
    freeShippingMinAmount: number;
    title: string;
    description: string;
  };
  guaranteedDevolution?: {
    enabled: false;
    day: number;
    title: string;
    description: string;
  };
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    googleMaps: string;
    logoUrl: string;
    iconUrl: string;
    legendUrl:string;
    shortName: string;
  };
  hasSubscription: boolean;
  isMaintenance: boolean;
  socialMedia:{
    twitter: string,
    facebook : string,
    instagram: string
  }
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
}));
