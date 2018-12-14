import { request, config } from '@/utils';

export async function getSupports({ typeName }) {
  const where = JSON.stringify({ typeName });
  return request(`${config.APIV1}/support?limit=10000&where=${where}`);
}

export async function checkPhone({ context }) {
  const where = JSON.stringify({ context });
  return request(`${config.APIV1}/phone?limit=1&where=${where}`);
}

export async function checkEmail({ context }) {
  const where = JSON.stringify({ context });
  return request(`${config.APIV1}/email?limit=1&where=${where}`);
}
