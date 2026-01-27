module.exports = function (plop) {
  plop.setGenerator('module', {
    description: 'Tạo trọn bộ Module (Controller, Service, Test)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Tên module là gì?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/modules/{{name}}s/{{name}}.module.ts',
        templateFile: 'plop/modules/module.template.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{name}}s/infrastructure/repository/postgres-{{name}}.repository.ts',
        templateFile: 'plop/modules/repository.template.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{name}}s/models/{{name}}.model.ts',
        templateFile: 'plop/modules/model.template.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{name}}s/controller/{{name}}.controller.ts',
        templateFile: 'plop/modules/controller.template.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{name}}s/services/{{name}}.service.ts',
        templateFile: 'plop/modules/service.template.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{name}}s/dto/{{name}}.request.dto.ts',
        templateFile: 'plop/modules/dto.request.template.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{name}}s/dto/{{name}}.response.dto.ts',
        templateFile: 'plop/modules/dto.response.template.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{name}}s/constants/{{name}}.constants.ts',
        templateFile: 'plop/modules/constants.template.hbs',
      },
    ],
  })

  plop.setHelper('titleCase', (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  })

  plop.setHelper('snakeCase', (str) => {
    return str
      .replace(/\W+/g, '.')
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('_')
  })
}
