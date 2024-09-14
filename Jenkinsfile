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
                    bat """
                    docker run -d --name ${DOCKER_CONTAINER} -p 3000:3000 \
                    -e APP_PORT=3000 \
                    -e SECRET=3747dc626706c0c6ffb6a8f26977458ce75fd3733c919f8d6221aba5dde90248 \
                    -e NODE_ENV=dev \
                    -e MONGODB_URI=mongodb+srv://jblandol:Camilo123456@cluster0.grey8ls.mongodb.net/ \
                    -e DB_NAME=ProductHunt \
                    -e DEV_MONGODB_URI=mongodb+srv://jblandol:Camilo123456@cluster0.grey8ls.mongodb.net/ \
                    -e DEV_DB_NAME=ProductHunt-Dev \
                    -e TEST_MONGODB_URI=mongodb+srv://jblandol:Camilo123456@cluster0.grey8ls.mongodb.net/ \
                    -e TEST_DB_NAME=ProductHunt-Test \
                    ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
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
