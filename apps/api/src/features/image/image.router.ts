import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { ingredients, recipes } from "@woj/db";
import { eq } from "drizzle-orm";
import { firstOrThrow } from "../../lib/db";
import { orpc } from "../../lib/orpc";

const MAX_SIZE = 1024;
const QUALITY = 80;

const tables = { ingredients, recipes };

const upload = orpc.images.upload.handler(async ({ context, input }) => {
  const table = tables[input.kind];
  const imageUrl = `${input.kind}/${input.id}.webp`;
  const path = join(context.env.IMAGES_DIRECTORY, imageUrl);
  await firstOrThrow(
    context.db
      .select({ id: table.id })
      .from(table)
      .where(eq(table.id, input.id)),
  );
  await mkdir(dirname(path), { recursive: true });
  await new Bun.Image(input.file)
    .resize(MAX_SIZE, MAX_SIZE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .write(path);
  await context.db
    .update(table)
    .set({ imageUrl })
    .where(eq(table.id, input.id));
  return { imageUrl };
});

export const imageRouter = orpc.images.router({ upload });
