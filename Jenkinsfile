pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "product-prowess-backend"
        DOCKER_TAG = "latest"
        DOCKER_CONTAINER = "contenedor-product-prowess-backend"
        ENV_FILE_PATH = 'C:/Users/jblan/Documents/Proyectos desarrollo/Electiva 2 (Desarrollo de software 2)/Jenkins/config/'
    }

    stages {
        stage('Checkout') {
            steps {
                // Clona el repositorio de GitHub
                git branch: 'feature/camilo', url: 'https://github.com/JuanCamiloBlandon/Product-Prowess-Backend.git'
            }
        }

        stage('Fetch Environment Variables') {
            steps {
                script {
                    // Copia el archivo .env al directorio de trabajo de Jenkins
                    bat "copy ${ENV_FILE_PATH} .env"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Construye la imagen Docker
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
                    
                    // Crear y ejecutar el nuevo contenedor con las variables de entorno
                    bat "docker run -d --name ${DOCKER_CONTAINER} -p 3000:3000 --env-file .env ${DOCKER_IMAGE}:${DOCKER_TAG}"
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
