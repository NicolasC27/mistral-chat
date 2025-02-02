import { Mistral } from '@lobehub/icons';
import { Input } from 'antd';
import { useTheme } from 'antd-style';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import ProviderConfig from '../components/ProviderConfig';
import { LLMProviderApiTokenKey, LLMProviderBaseUrlKey, LLMProviderConfigKey } from '../const';

const providerKey = 'mistral';

const MistralProvider = memo(() => {
  const { t } = useTranslation('setting');

  const theme = useTheme();

  return (
    <ProviderConfig
      configItems={[
        {
          children: (
            <Input.Password
              autoComplete={'new-password'}
              placeholder={t('llm.Mistral.token.placeholder')}
            />
          ),
          desc: t('llm.Mistral.token.desc'),
          label: t('llm.Mistral.token.title'),
          name: [LLMProviderConfigKey, providerKey, LLMProviderApiTokenKey],
        },
        {
          children: <Input placeholder={t('llm.Mistral.endpoint.placeholder')} />,
          desc: t('llm.Mistral.endpoint.desc'),
          label: t('llm.Mistral.endpoint.title'),
          name: [LLMProviderConfigKey, providerKey, LLMProviderBaseUrlKey],
        },
      ]}
      provider={providerKey}
      title={
        <Mistral.Combine
          color={theme.isDarkMode ? theme.colorText : Mistral.colorPrimary}
          size={24}
        />
      }
    />
  );
});

export default MistralProvider;
