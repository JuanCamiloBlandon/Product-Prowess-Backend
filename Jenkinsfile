pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "product-prowess-backend"
        DOCKER_TAG = "latest"
        DOCKER_CONTAINER = "contenedor-product-prowess-backend"
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
                    // Copy the .env file from the config directory
                    bat 'copy "C:/Users/jblan/Documents/Proyectos desarrollo/Electiva 2 (Desarrollo de software 2)/Jenkins/config/" .env'
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



