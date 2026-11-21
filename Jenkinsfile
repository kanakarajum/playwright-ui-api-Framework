
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Execute Web Tests') {
            steps {
                bat 'npm run webtestsAllure'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'allure-results/**',
                allowEmptyArchive: true
        }
    }
}
