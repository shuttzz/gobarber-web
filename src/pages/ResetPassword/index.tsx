import React, { useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import logoImg from '../../assets/logo.svg';

import { Background, Container, AnimationContainer, Content } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ResetPasswordFormData {
	password: string;
	password_confirmation: string;
}

const ResetPassword: React.FC = () => {
	const formRef = useRef<FormHandles>(null);
	const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

	const handleSubmit = useCallback(
		async (data: ResetPasswordFormData) => {
			try {
				formRef.current?.setErrors({});
				const schema = Yup.object().shape({
          password: Yup.string().required('Senha é obrigatória'),
          password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), undefined], 'As senhas não são iguais')
				});

				await schema.validate(data, {
					abortEarly: false,
				});

        const token = location.search.replace('?token=', '');
        const { password, password_confirmation } = data;

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          passwordConfirmation: password_confirmation,
          token,
        });

				history.push('/');
			} catch (e) {
				if (e instanceof Yup.ValidationError) {
					const errors = getValidationErrors(e);

					formRef.current?.setErrors(errors);
					return;
				}

				addToast({
					type: 'error',
					title: 'Erro ao resetar senha',
					description:
						'Ocorreu um erro ao resetar sua senha, tente novamente.',
				});
			}
		},
		[addToast, history, location.search],
	);

	return (
		<Container>
			<Content>
				<AnimationContainer>
					<img src={logoImg} alt="GoBarber" />

					<Form ref={formRef} onSubmit={handleSubmit}>
						<h1>Resetar senha</h1>

						<Input
							name="password"
							icon={FiLock}
							type="password"
							placeholder="Nova senha"
						/>

            <Input
							name="password_confirmation"
							icon={FiLock}
							type="password"
							placeholder="Confirmação da senha"
						/>

						<Button type="submit">Alterar senha</Button>

					</Form>
				</AnimationContainer>
			</Content>
			<Background />
		</Container>
	);
};

export default ResetPassword;
