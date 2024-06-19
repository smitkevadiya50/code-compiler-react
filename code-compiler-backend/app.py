from flask import Flask, request, jsonify
import subprocess
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins=["http://192.168.178.59:3000"])  # Allow CORS for all domains

@app.route('/run', methods=['POST'])
def run_code():
    code = request.json.get('code')
    language = request.json.get('language')
    response = {}

    try:
        if language == 'python':
            process = subprocess.Popen(['python3', '-c', code], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        elif language == 'java':
            with open('Solution.java', 'w') as file:
                file.write(code)
            subprocess.run(['javac', 'Solution.java'])
            process = subprocess.Popen(['java', 'Solution'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        elif language == 'javascript':
            process = subprocess.Popen(['node', '-e', code], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        elif language == 'typescript':
            with open('Solution.ts', 'w') as file:
                file.write(code)
            subprocess.run(['tsc', 'Solution.ts'])
            process = subprocess.Popen(['node', 'Solution.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        else:
            response = {'error': 'Unsupported language'}
            return jsonify(response)

        output, error = process.communicate()
        response = {
            'output': output.decode('utf-8'),
            'error': error.decode('utf-8')
        }

        # Clean up files
        if os.path.exists('Solution.java'):
            os.remove('Solution.java')
        if os.path.exists('Solution.class'):
            os.remove('Solution.class')
        if os.path.exists('Solution.ts'):
            os.remove('Solution.ts')
        if os.path.exists('Solution.js'):
            os.remove('Solution.js')

    except Exception as e:
        response = {'error': str(e)}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)