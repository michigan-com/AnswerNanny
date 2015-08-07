export default function getRequiredEnvVar(name) {
  let v = process.env[name];
  if (typeof v === 'undefined') {
   throw new Error(`Please set ${name} environment variable`);
  }
  return v;
}
