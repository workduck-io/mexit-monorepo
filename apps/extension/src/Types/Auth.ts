export interface LoginFormData {
  email: string
  password: string
}

export interface Option {
  label: string
  value: string
}

export interface RegisterFormData {
  name: string
  roles: Option[]
  email: string
  password: string
}

export interface VerifyFormData {
  code: string
}
