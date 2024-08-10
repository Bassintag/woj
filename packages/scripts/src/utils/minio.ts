import * as Minio from "minio";

export const createMinioClient = () => {
  const options = {
    endPoint: "localhost",
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY as string,
    secretKey: process.env.MINIO_SECRET_KEY as string,
  };
  console.log(options);
  return new Minio.Client(options);
};
