import React, {useCallback, useRef, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiLogIn, FiMail} from 'react-icons/fi';
import * as Yup from 'yup';
import {Form} from '@unform/web';
import {FormHandles} from '@unform/core';

import logoImg from '../../assets/logo.svg';

import {AnimationContainer, Background, Container, Content} from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import {useToast} from '../../hooks/toast';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const {addToast} = useToast();
  // const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description: 'Enviamos um e-mail para confirmar a recuperação de senha, cheque seu e-mail',
        });

        // history.push('/dashboard');
      } catch (e) {
        if (e instanceof Yup.ValidationError) {
          const errors = getValidationErrors(e);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber"/>

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input
              name="email"
              icon={FiMail}
              type="text"
              placeholder="E-mail"
            />

            <Button loading={loading} type="submit">Recuperar</Button>
          </Form>

          <Link to="/">
            <FiLogIn/>
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background/>
    </Container>
  );
};

export default ForgotPassword;
