import { MAX_FILE_SIZE } from "$lib/default";
import { z } from "zod";


export const urlSchema = z.url("Hook url invalid").trim();

export const fileSchema = z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `File size cannot be greater than ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
});

export const filesSchema = fileSchema.array().max(10, "Files length must be less than 10 files");

export const authorSchema = z.object({
    name: z.string().max(256, "Username length must be less than 256 characters"),
    url: z.string().trim().url("Please enter a valid  URL for the author url"),
    icon_url: z.string().trim().url("Please enter a valid image URL for the author embed icon"),
});

export const fieldsSchema = z.object({
    name: z.string().max(256, "Embed field name length must be less than 256 characters"),
    value: z.string().max(1024, "Embed field value length must be less than 1024 characters"),
    inline: z.boolean().optional(),
});

export const embedsSchema = z.object({
    avatar_url: z.string().trim().url("Please enter a valid image URL for the avatar").optional(),
    color: z.number().optional(),
    author: authorSchema.optional(),
    title: z.string().max(256, "Title length must be less than 256 characters"),
    description: z.string().max(4096, "Description length must be less than 4096 characters"),
    image: z.object({ url: z.string().url("Please enter a valid image URL for the embed image") }).optional(),
    fields: fieldsSchema.array().max(25, "Fields length must be less than 25 fields per embed").optional(),
    footer: z.object({
        text: z.string().max(2048, "Footer text length must be less than 2048 characters").optional(),
        icon_url: z.string().url("Please enter a valid image URL for the footer embed icon")
    }).optional(),
    thumbnail: z.object({ url: z.string().url("Please enter a valid image URL for the embed thumbnail") }).optional(),
    url: z.string().trim().url("Please enter a valid  URL for the embed url").optional(),
});

export const hookJsonSchema = z
    .object({
        username: z.string().trim().max(80, "Username length must be less than 80 characters"),
        avatar_url: z.string().url("Please enter a valid image URL for the profile avatar"),
        content: z.string().max(2000, "Content length must be less than 2,000 characters"),
        embeds: embedsSchema.array().max(10, "Embeds length must be less than 10 items").optional(), //.max(10, "Embeds length must be less than 10 items")
        files: filesSchema.optional(),
        thread_name: z.string().max(100, "Thread name length must be less than 100 characters"),
    })

    

export const hookJsonPartial = z
    .object({
        username: z.string().trim().max(80, "Username length must be less than 80 characters").optional(),
        avatar_url: z.string().url("Please enter a valid image URL for the profile avatar").optional(),
        content: z.string().max(2000, "Content length must be less than 2,000 characters").optional(),
        embeds: embedsSchema.array().max(10, "Embeds length must be less than 10 items").optional(), //.max(10, "Embeds length must be less than 10 items")
        files: filesSchema.optional(),
        thread_name: z.string().max(100, "Thread name length must be less than 100 characters").optional(),
    }).partial()
export const embedsPartial = embedsSchema.partial()



export type hookJsonSchemaType = z.infer<typeof hookJsonSchema>
export type hookJsonPartialSchemaType = z.infer<typeof hookJsonPartial>
export type embedsPartialSchemaType = z.infer<typeof embedsPartial>
export type embedsSchemaType = z.infer<typeof embedsSchema>
export type fieldsSchemaType = z.infer<typeof fieldsSchema>
export type authorSchemaType = z.infer<typeof authorSchema>
export type filesSchemaType = z.infer<typeof filesSchema>
export type fileSchemaType = z.infer<typeof fileSchema>
export type urlSchemaType = z.infer<typeof urlSchema>


export const authorFullyPartialSchema = z.object({
    name: z.string().max(256, "Username length must be less than 256 characters").optional(),
    url: z.string().trim().optional(),
    icon_url: z.string().trim().optional(),
});

export const fieldsFullyPartialSchema= z.object({
    name: z.string().max(256, "Embed field name length must be less than 256 characters").optional(),
    value: z.string().max(1024, "Embed field value length must be less than 1024 characters").optional(),
    inline: z.boolean().optional(),
});


export const embedsFullyPartialSchema = z.object({
    //avatar_url: z.string().trim().optional(),
    title: z.string().max(256, "Title length must be less than 256 characters").optional(),
    description: z.string().max(4096, "Description length must be less than 4096 characters").optional(),
    color: z.number().optional(),
    url: z.string().trim().optional(),

    author: authorFullyPartialSchema.optional(),
    image: z.object({ url: z.string() }).optional(),
    fields: fieldsFullyPartialSchema.array().max(25, "Fields length must be less than 25 fields per embed").optional(),
    footer: z.object({
        text: z.string().max(2048, "Footer text length must be less than 2048 characters").optional(),
        icon_url: z.string().optional()
    }).optional(),
    thumbnail: z.object({ url: z.string() }).optional(),
});

export const hookJsonFullyPartialSchema  = z
    .object({
        username: z.string().trim().max(80, "Username length must be less than 80 characters").optional(),
        avatar_url: z.string().optional(),
        content: z.string().max(2000, "Content length must be less than 2,000 characters").optional(),
        embeds: embedsFullyPartialSchema.array().max(10, "Embeds length must be less than 10 items").optional(), //.max(10, "Embeds length must be less than 10 items")
        files: filesSchema.optional(),
        thread_name: z.string().max(100, "Thread name length must be less than 100 characters").optional(),
    }).partial()

export type authorFullyPartialSchemaType = z.infer<typeof authorFullyPartialSchema>