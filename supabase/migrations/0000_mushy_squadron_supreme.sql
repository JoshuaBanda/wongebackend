CREATE TABLE IF NOT EXISTS "shoptable" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"whatsappMessage" text NOT NULL,
	"photoId" serial NOT NULL,
	"publicId" text,
	"url" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
