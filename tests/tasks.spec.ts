import { expect, test } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'
import data from './fixtures/tasks.json'


//Criando a variavel tasksPage
let tasksPage: TasksPage

//Intanciando a variavel tasksPage no contexto de page antes de cada execução 
test.beforeEach(({page})=>{
    tasksPage = new TasksPage(page)
})

//Describe com testes relacionados a cadastro
test.describe('cadastro', () => {
    test('deve poder cadastrar uma nova tarefa', async ({ request }) => {

        //Const 'task' recebendo os dados de 'sucess' do arquivo /fixtures/tasks.json sendo do tipo TaskModel
        const task = data.sucess as TaskModel

        //Chamando a função para deletar cadastros com o mesmo 'task.name' caso exista
        await deleteTaskByHelper(request, task.name)

        //Acessando a pagina inicial
        await tasksPage.go()
        //Criando a tarefa com os dados de 'task'
        await tasksPage.create(task)
        //Validando se a tarefa foi efetivamente criada
        await tasksPage.shouldHaveText(task.name)
    })

    test('não deve permitir tarefa duplicada', async ({ request }) => {

        //Const 'task' recebendo os dados de 'duplicate' do arquivo /fixtures/tasks.json sendo do tipo TaskModel
        const task = data.duplicate as TaskModel
        //Chamando a função para deletar cadastros com o mesmo 'task.name' caso exista
        await deleteTaskByHelper(request, task.name)
        //Cadastrando a tarefa pela primeira vez
        await postTask(request, task)

        //Acessando a pagina inicial
        await tasksPage.go()
        //Criando a tarefa com os dados de 'task'
        await tasksPage.create(task)
        //Validando se a tarefa já existe
        await tasksPage.alertHaveText('Task already exists!')

    })

    test('campo obrigatorio', async () => {
        
        //Const 'task' recebendo os dados de 'required' do arquivo /fixtures/tasks.json sendo do tipo TaskModel
        const task = data.required as TaskModel
        
        //Acessando a pagina inicial
        await tasksPage.go()
        //Criando a tarefa com os dados de 'task'
        await tasksPage.create(task)

        //Atribuindo o valor identificado no 'inputTaskName' do HTML à const 'validationMessage'
        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        //Validando se a menssagem identificada no HTML é igual a menssagem esperada 
        expect(validationMessage).toEqual('This is a required field')
    })
})

test.describe('atualização', () => {
    test('Deve concluir uma tarefa', async ({ request }) => {
        //Const 'task' recebendo os dados de 'update' do arquivo /fixtures/tasks.json sendo do tipo TaskModel
        const task = data.update as TaskModel

        //Chamando a função para deletar cadastros com o mesmo 'task.name' caso exista
        await deleteTaskByHelper(request, task.name)
        //Cadastrando a tarefa pela primeira vez
        await postTask(request, task)

        //Acessando a pagina inicial
        await tasksPage.go()
        //Marcando a tarefa como concluida
        await tasksPage.toggle(task.name)
        //Validando se a tarefa foi marcada como concluida
        await tasksPage.shouldBeDone(task.name)
    })
})

test.describe('exclusão', () => {
    test('Deve excluir uma tarefa', async ({ request }) => {

        //Const 'task' recebendo os dados de 'delete' do arquivo /fixtures/tasks.json sendo do tipo TaskModel
        const task = data.delete as TaskModel

        //Chamando a função para deletar cadastros com o mesmo 'task.name' caso exista
        await deleteTaskByHelper(request, task.name)
        //Cadastrando a tarefa pela primeira vez
        await postTask(request, task)

        //Acessando a pagina inicial
        await tasksPage.go()
        //Removendo a tarefa 
        await tasksPage.remove(task.name)
        //Validando se a tarefa foi removida
        await tasksPage.shouldNotExist(task.name)
    })
})