import { z } from "zod";

export type TelegramMessageInput = {
  chatId: string;
  message: string;
};

export type TelegramMessageOptions = TelegramMessageInput & {
  botToken: string;
};

export type TelegramSendMessageRequest = {
  chat_id: string;
  text: string;
};

export type TelegramSendMessageResponse = {
  ok: boolean;
  result?: {
    message_id: number;
  };
  description?: string;
};

export type TelegramMessageOutput = {
  ok: true;
  chatId: string;
  messageId: number;
};

type TelegramMessageInputShape = {
  chatId: z.ZodString;
  message: z.ZodString;
};

type TelegramMessageOptionsShape = TelegramMessageInputShape & {
  botToken: z.ZodString;
};

type TelegramSendMessageRequestShape = {
  chat_id: z.ZodString;
  text: z.ZodString;
};

type TelegramSendMessageResponseShape = {
  ok: z.ZodBoolean;
  result: z.ZodOptional<
    z.ZodObject<{
      message_id: z.ZodNumber;
    }>
  >;
  description: z.ZodOptional<z.ZodString>;
};

type TelegramMessageOutputShape = {
  ok: z.ZodLiteral<true>;
  chatId: z.ZodString;
  messageId: z.ZodNumber;
};

export const telegramMessageInputSchema: z.ZodObject<TelegramMessageInputShape> = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  message: z.string().min(1, "Message text is required"),
});

export const telegramMessageOptionsSchema: z.ZodObject<TelegramMessageOptionsShape> = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  message: z.string().min(1, "Message text is required"),
  botToken: z.string().min(1, "Telegram bot token is required"),
});

export const telegramSendMessageRequestSchema: z.ZodObject<TelegramSendMessageRequestShape> =
  z.object({
    chat_id: z.string().min(1),
    text: z.string().min(1),
  });

export const telegramSendMessageResponseSchema: z.ZodObject<TelegramSendMessageResponseShape> =
  z.object({
    ok: z.boolean(),
    result: z
      .object({
        message_id: z.number(),
      })
      .optional(),
    description: z.string().optional(),
  });

export const telegramMessageOutputSchema: z.ZodObject<TelegramMessageOutputShape> = z.object({
  ok: z.literal(true),
  chatId: z.string(),
  messageId: z.number(),
});
