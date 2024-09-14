pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "product-prowess-backend"
        DOCKER_TAG = "latest"
        DOCKER_CONTAINER = "contenedor-product-prowess-backend"
        PATH_ENVIRONMENT_VARIABLES = "C:/Users/jblan/Documents/Proyectos desarrollo/Electiva 2 (Desarrollo de software 2)/Jenkins/config/"
    }

    stages {
        stage('Checkout') {
            steps {
                // Se  clona el repositorio de GitHub
                git branch: 'feature/camilo', url: 'https://github.com/JuanCamiloBlandon/Product-Prowess-Backend.git'
            }
        }

        stage('Fetch Environment Variables') {
            steps {
                script {
                    // Se copia las variables de entorno de un directorio local a la carpeta del proyecto
                    bat "copy \"${PATH_ENVIRONMENT_VARIABLES}\" .env"
                }
            }
        }

         stage('Install Dependencies') {
            steps {
                script {
                    // Se instala las dependencias del proyecto
                    bat 'npm install'
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                script {
                    // Ejecuta las pruebas unitarias con npm
                    bat "docker stop ${DOCKER_CONTAINER} || exit 0"

                    // Detener el contenedor si está en ejecución
                    bat 'npm test'
                }
            }
        }
      
        stage('Build Docker Image') {
            steps {
                script {
                    // Se construye la imagen Docker
                    bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Detener el contenedor si está en ejecución
                    bat "docker stop ${DOCKER_CONTAINER} || exit 0"
                    
                    // Eliminar el contenedor si existe
                    bat "docker rm ${DOCKER_CONTAINER} || exit 0"
                    
                    // Crear y ejecutar el nuevo contenedor
                    bat "docker run -d --name ${DOCKER_CONTAINER} -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
    }

    post {
        always {
            // Limpia los contenedores y las imágenes después de la ejecución
            bat 'docker system prune -f'
        }
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Build or deployment failed!'
        }
    }
}



