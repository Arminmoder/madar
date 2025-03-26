from flask import Flask, request, render_template

app = Flask(__name__, template_folder="temp")


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/final-submit', methods=['POST'])
def final_submit():
    # دریافت مقادیر اولیه
    nodes = request.form.get("nodes")
    resistance = request.form.get("resistance")
    currentGenerator = request.form.get("currentGenerator")

    # دریافت مقادیر اضافی (دینامیکی)
    resistances = {k: v for k, v in request.form.items() if k.startswith("r")}
    currents1 = {k: v for k, v in request.form.items() if k.startswith("i")}

    def determinant(matrix):
        # بررسی اگر ماتریس فقط یک درایه داشته باشد، مقدار همان درایه را برمی‌گردانیم
        if len(matrix) == 1:
            return matrix[0][0]
        
        # بررسی اگر ماتریس 2x2 باشد، فرمول ساده‌ی دترمینان را اعمال می‌کنیم
        if len(matrix) == 2:
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
        
        # مقدار اولیه‌ی دترمینان را صفر می‌گذاریم
        det = 0
        
        # پیمایش سطر اول ماتریس برای محاسبه دترمینان
        for col in range(len(matrix)):
            # ایجاد ماتریس جزئی (کوچک‌تر) با حذف سطر اول و ستون جاری
            sub_matrix = [row[:col] + row[col+1:] for row in matrix[1:]]
            
            # اعمال فرمول دترمینان با استفاده از بسط لاپلاس
            cofactor = ((-1) ** col) * matrix[0][col] * determinant(sub_matrix)
            det += cofactor
        
        return det




    nude = int(nodes)
    resistors = int(resistance)
    currents = int(currentGenerator)
    matrix = [[0 for _ in range(nude)] for _ in range(nude)]
    matrixR = [[0 for _ in range(nude)] for _ in range(nude)]
    matrixI = [[0] for _ in range(nude)]

    for _ in range(resistors):
        n1, n2, Re = map(float,resistances[f"r{_+1}"].split())
        n1, n2 = int(n1) - 1, int(n2) - 1 
        conductance = round(1 / Re, 6)
        matrixR[n1][n1] += conductance
        # کندکدانس ها را در قطر اصلی جمع میکنه
        if n2 >= 0:
            matrixR[n2][n2] += conductance
        # کندکدانس ها را در قطر اصلی جمع میکنه
            matrixR[n1][n2] -= conductance
            matrixR[n2][n1] -= conductance
            # کندکدانس های مربوط به گره های متصل را از هم کم میکنه





    for _ in range(currents):
        n1, Co = map(float,currents1[f"i{_+1}"].split())
        n1 = int(n1) - 1
        Co = round(Co, 6)
        matrixI[n1][0] += Co 

    result = {}
    for i in range(nude):
       
        for a in range(nude):
            for b in range(nude):
                matrix[a][b] = matrixR[a][b]
        for j in range(nude):
            matrix[j][i] = matrixI[j][0]
        if( matrixR == 0 or matrix == 0):
            result= str(result)
            result = "javab nadarad"
        else:
            result[f"v{i+1}"] = round(determinant(matrix)/determinant(matrixR), 6)
        
        


    return render_template('result.html', result=result)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)