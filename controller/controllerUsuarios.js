const bcrypt = require('bcrypt');
const { Usuario } = require('../model/modelos');
const passport = require('passport');

exports.cria_get = function(req, res){
    const contexto = {
        titulo_pagina: 'Cadastro de Usuario',
    };

    return res.render('cria_usuario', contexto);
};

exports.cria_post = async function(req, res){
    const novo_usuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        confirmacao_senha: req.body.confirmacao_senha,
    };

    const errors = [];
    if(!novo_usuario.nome || novo_usuario.nome.trim() === ''){
        errors.push({
            msg: 'Nome é obrigatório'
        });
    }

    // Tratamento para normalizar o email, removendo espaços e convertendo para minúsculas
    const email_normalizado = (novo_usuario.email || '').trim().toLowerCase();

    // Recurso para tentar identificar emails válidos
    const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email_normalizado || !regex_email.test(email_normalizado)){
        errors.push({
            msg: 'E-maill inválido'
        });
    }

    if(!novo_usuario.senha || novo_usuario.senha.length < 6){
        errors.push({
            msg: 'Senha deve ter no minímo 6 caracteres'
        });
    }

    if(novo_usuario.senha !== novo_usuario.confirmacao_senha){
        errors.push({
            msg: 'Confirmação de senha não confere'
        });
    }

    if(errors.length > 0){
        const contexto = {
            titulo_pagina: 'Cadastro de Usuario',
            errors: errors,
            old: {
                nome: novo_usuario.nome,
                email: novo_usuario.email,
            }
        };
        return res.status(400).render('cria_usuario', contexto);
    }

    try{
        const usuario_existente = await Usuario.findOne({
            where: {
                email: email_normalizado
            }
        });
        if(usuario_existente){
            const contexto = {
                titulo_pagina: 'Cadastro de Usuario',
                errors: [{
                    msg: 'Já existe um usuário cadastrado com este e-mail'
                }],
                old: {
                    nome: novo_usuario.nome,
                    email: novo_usuario.email,
                }
            };
            return res.status(400).render('cria_usuario', contexto);
        }

        // Geração de hash da senha com bcrypt, utilizando 10 rounds de salt (padrão recomendado)
        const senha_hash = await bcrypt.hash(novo_usuario.senha, 10);

        await Usuario.create(
            {
                nome: novo_usuario.nome,
                email: email_normalizado,
                senha_hash: senha_hash,
            }
        );
        return res.redirect('/');
    }catch(error){
        console.error('Erro ao criar usuário:', error);
        return res.status(500).send('Erro ao criar usuário');
    }
};

exports.login_get = function(req, res){
    const contexto = {
        titulo_pagina: 'Login',
    };

    return res.render('login', contexto);
};

exports.login_post = function(req, res, next){
    // executa a função de autenticação criada no arquivo config / passport.js, e avalia o retorno
    passport.authenticate('local', (err, user, info) => {
        if(err)
            return res.status(500).send('Erro ao autenticar');

        if(!user){
            const contexto = {
                titulo_pagina: 'Login',
                errors: [{
                    msg: info.message || 'Credenciais inválidas'
                }],
                old: {
                    email: req.body.email,
                }
            };
            return res.status(401).render('login', contexto);
        }

        // realiza login do usuario
        req.login(user, (err) => {
            if(err)
                return res.status(500).send('Erro ao fazer login');

            return res.redirect('/');
        });
    })(req, res, next);
};

exports.logout = function(req, res, next){
    req.logout((err) => {
        if(err)
            return res.status(500).send('Erro ao fazer logout');

        return res.redirect('/');
    });
};