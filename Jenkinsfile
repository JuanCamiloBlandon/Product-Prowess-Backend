pipeline {
    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                // Checkout the repository
                checkout scm
            }
        }

        stage('Fetch Environment Variables') {
            steps {
                script {
                    // Copy the .env file from the config directory
                    bat 'copy "C:/Users/jblan/Documents/Proyectos desarrollo/Electiva 2 (Desarrollo de software 2)/Jenkins/config/.env" .env'
                }
            }
        }

        stage('Build Docker Image') {
            when {
                expression { fileExists('.env') }
            }
            steps {
                // Build the Docker image using the .env file
                echo 'Building Docker image...'
                bat 'docker build -t your_image_name .'
            }
        }

        stage('Deploy') {
            when {
                expression { fileExists('.env') }
            }
            steps {
                // Deploy the Docker container
                echo 'Deploying Docker container...'
                bat 'docker run -d your_image_name'
            }
        }
    }

    post {
        always {
            script {
                // Clean up Docker system after build
                bat 'docker system prune -f'
            }

            // Notify failure if the build fails
            failure {
                echo 'Build or deployment failed!'
            }
        }
    }
}
