import { ModelProviderCard } from '@/types/llm';

const Mistral: ModelProviderCard = {
  chatModels: [
    {
      description: 'Mistral',
      displayName: 'Mistral',
      functionCall: true,
      id: 'mistral',
      tokens: 5000,
    },
  ],
  enabled: true,
  id: 'mistral',
};

export default Mistral;
