import { get } from 'env-var';

export class OpenAIConfig {
  public static readonly apiKey: string = get('OPENAI_API_KEY')
    .required()
    .asString();
}
