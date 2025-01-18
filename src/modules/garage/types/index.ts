export interface ICreateGarageBody {
  name: string;
  description?: string;
  contact_no: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  start_time: string;
  end_time: string;
}

export interface IUpdateGarageBody {
  name?: string;
  description?: string;
  contact_no?: string;
  email?: string;
  address?: string;
  city?: string;
  pincode?: string;
  start_time?: string;
  end_time?: string;
}
