import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../user.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { createMockPrismaService, mockConfigService, mockFindMany, MockListarUsuarios } from '../../../test/mocks/prisma-helpers';
import { usuarioMock, usuariosMock } from '../../../test/mocks/usuarios-helpers';

/**
 * 
### 6. `validarEmail()` e `verificarSeOEmailJaExiste()`
- `validarEmail()` com email já usado por outro usuário diferente do `id` passado
  - hoje o código retorna `{ email }` nesse caso; vale testar esse comportamento explícito
- caso de email inválido sem `@` já está coberto, mas também dá para testar:
  - email válido e não existente retorna `{ email }`
 */
describe('UserService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  // Mock do PrismaService
  const mockPrismaService = createMockPrismaService('user');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa mocks entre testes
  });

  it('Deve definir o serviço', () => {
    expect(service).toBeDefined();
  });

  it('verificarSeOEmailJaExiste() deve validar e-mail válido e não existente', async () => {
    // Mock do helpers
    MockListarUsuarios(service, []);

    const emailValido = 'usuario@emailvalido.com';
    const resultado = await service.verificarSeOEmailJaExiste(emailValido);
    expect(resultado).toEqual(false);
  });

  it('verificarSeOEmailJaExiste() deve retornar um e-mail existente de outro usuário', async () => {

    // Usa o helper para mockar findMany
    mockFindMany(prismaService, 'user', usuariosMock);

    const emailExistente = 'usuario@emailvalido.com';
    const resultado = await service.verificarSeOEmailJaExiste(emailExistente);

    expect(resultado).toEqual(usuariosMock.at(0));
  });

  it('validarEmail() deve validar e-mail existente para o mesmo usuário (com id)', async () => {
    // Mock do helpers
    MockListarUsuarios(service, usuariosMock);

    const emailExistente = usuarioMock.email as string;
    const resultado = await service.validarEmail(emailExistente, 123);
    expect(resultado).toEqual({ email: emailExistente });
  });

  it('validarEmail() deve retornar mensagem para e-mail inválido', async () => {
    // Mock do helpers
    MockListarUsuarios(service, []);

    const emailInvalido = 'usuarioemailinvalido.com';
    const resultado = await service.validarEmail(emailInvalido);
    expect(resultado).toHaveProperty('message');
  });

  it('validarEmail() com e-mail diferente do ID passado', async () => {
    MockListarUsuarios(service, usuariosMock);

    const resultado = await service.validarEmail(usuariosMock.at(0)?.email as string, usuariosMock.at(1)?.id);

    expect(resultado).toHaveProperty('message');
  });


  it('validarSenha() deve validar uma senha', async () => {
    const senha = '12345678910';
    const resultado = await service.validarSenha(senha);
    expect(resultado).toHaveProperty('hash');
  });

  it('validarSenha() deve retornar uma mensagem para senha inválida', async () => {
    const senha = '1234';
    const resultado = await service.validarSenha(senha);
    expect(resultado).toHaveProperty('message');
  });


});