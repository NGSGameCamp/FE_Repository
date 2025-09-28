export interface PublisherCompany {
  name: string;
  registrationNumber: string;
  registeredAt: string;
  description: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoColor: string;
}

export interface ApiResult<T> {
  data: T;
  isMock: boolean;
}
