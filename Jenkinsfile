pipeline {
    agent any

    environment {
        // === Git Repository ===
        GIT_REPO_URL    = 'http://192.168.1.77:3002/cowary/air-tracker-front-v2.git'
        DEFAULT_BRANCH  = 'master'

        // === Docker Registry (Forgejo) ===
        REGISTRY        = '192.168.1.77:3002'
        REGISTRY_USER   = 'cowary'
        REGISTRY_CREDS  = 'forgejo-credentials'

        // === Docker Hub ===
        DHUB_USER      = 'cowary'
        DHUB_CREDS     = 'docker-hub-creds'

        // === Image Names & Tags ===
        IMAGE_NAME      = 'air-tracker-front'
        IMAGE_TAG       = 'latest'
        FULL_IMAGE      = "${REGISTRY}/${REGISTRY_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
        DHUB_IMAGE      = "${DHUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"

        // === Deployment ===
        DEPLOY_HOST     = '192.168.1.77'
        DEPLOY_USER     = 'sasha'
        DEPLOY_DIR      = '/home/sasha/docker/air-tracker-front'
        DEPLOY_CREDS   = 'v1-ssh-server'
        BACKEND_URL     = 'http://192.168.1.74:8080'
    }

    tools {
        dockerTool 'docker'
    }

    parameters {
        string(
            name: 'BRANCH_NAME',
            defaultValue: env.DEFAULT_BRANCH ?: 'master',
            description: 'Branch to build and deploy from'
        )
        string(
            name: 'DEPLOY_HOST',
            defaultValue: env.DEPLOY_HOST ?: '192.168.1.79',
            description: 'Deployment target host IP'
        )
        choice(
            name: 'DEPLOY_ENABLED',
            choices: ['true', 'false'],
            description: 'Enable deployment stage'
        )
        string(
            name: 'BACKEND_URL',
            defaultValue: env.BACKEND_URL ?: 'http://192.168.1.74:8080',
            description: 'Backend URL for nginx proxy (runtime, no rebuild needed)'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm: [
                    $class: 'GitSCM',
                    branches: [[name: params.BRANCH_NAME]],
                    doGenerateSubmoduleConfigurations: false,
                    userRemoteConfigs: [[url: env.GIT_REPO_URL]]
                ]
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build \
                        -t ${IMAGE_NAME}:${IMAGE_TAG} \
                        .
                """
            }
        }

        stage('Tag & Push to Forgejo Registry') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: env.REGISTRY_CREDS,
                    usernameVariable: 'REG_USER',
                    passwordVariable: 'REG_PASS'
                )]) {
                    sh """
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${FULL_IMAGE}

                        echo "\${REG_PASS}" | docker login ${REGISTRY} \
                            -u "\${REG_USER}" \
                            --password-stdin

                        docker push ${FULL_IMAGE}

                        docker logout ${REGISTRY}
                    """
                }
            }
        }

        stage('Tag & Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: env.DHUB_CREDS,
                    usernameVariable: 'DHUB_USER_VAR',
                    passwordVariable: 'DHUB_PASS'
                )]) {
                    sh """
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DHUB_IMAGE}

                        echo "\${DHUB_PASS}" | docker login \
                            -u "\${DHUB_USER_VAR}" \
                            --password-stdin

                        docker push ${DHUB_IMAGE}

                        docker logout
                    """
                }
            }
        }

        stage('Deploy to Server') {
            when {
                expression { params.DEPLOY_ENABLED == 'true' }
            }
            steps {
                sshagent(credentials: [env.DEPLOY_CREDS]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${params.DEPLOY_HOST} '
                            cd ${DEPLOY_DIR} &&
                            BACKEND_URL=${params.BACKEND_URL} docker compose pull &&
                            BACKEND_URL=${params.BACKEND_URL} docker compose up -d
                        '
                    """
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
            sh "docker rmi ${FULL_IMAGE} || true"
        }
        success {
            echo "✅ Frontend build, push and deploy successful!"
        }
        failure {
            echo "❌ Frontend build or deploy failed."
        }
    }
}
