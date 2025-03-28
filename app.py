import matplotlib.pyplot as plt
import networkx as nx
from flask import Flask, request, render_template
import matplotlib
matplotlib.use('Agg')  

app = Flask(__name__, template_folder="temp")


@app.route('/')
def index():
    return render_template("index.html")

viwe =0
@app.route('/final-submit', methods=['POST'])
def final_submit():
    global viwe
    viwe +=1
    # دریافت مقادیر اولیه
    nodes = request.form.get("nodes")
    resistance = request.form.get("resistance")
    currentGenerator = request.form.get("currentGenerator")

    # دریافت مقادیر اضافی (دینامیکی)
    resistances = {k: v for k, v in request.form.items() if k.startswith("r")}
    currents = {k: v for k, v in request.form.items() if k.startswith("i")}

    def draw_circuit(resistors, currents, filename="circuit.png"):
        # ایجاد گراف‌ها
        G = nx.DiGraph()  # گراف جهت‌دار برای جریان‌ها
        Y = nx.Graph()  # گراف غیرجهت‌دار برای مقاومت‌ها
        G_all = nx.Graph()  # گراف کمکی شامل همه گره‌ها

        # اضافه کردن مقاومت‌ها
        for r in resistors:
            Y.add_edge(r[0], r[1], resistance=r[2])
            G_all.add_edge(r[0], r[1])  # گره‌ها را به گراف کمکی اضافه می‌کنیم

        # اضافه کردن جریان‌ها
        for c in currents:
            G.add_edge(c[0], c[1], current=c[2])
            G_all.add_edge(c[0], c[1])  # گره‌ها را به گراف کمکی اضافه می‌کنیم

        # تنظیم موقعیت گره‌ها بر اساس گراف کامل
        pos = nx.spring_layout(G_all)  # ایجاد موقعیت برای همه‌ی گره‌ها

        # رسم مقاومت‌ها بدون فلش
        edge_labels = {(r[0], r[1]): f'R={r[2]}' for r in resistors}
        nx.draw(Y, pos, with_labels=True, node_color="lightblue",
                edge_color="black", width=1.5)
        nx.draw_networkx_edge_labels(
            Y, pos, edge_labels=edge_labels, font_size=10, font_color="black")

        # رسم جریان‌ها با فلش‌ها و رنگ قرمز
        current_edges = [(c[0], c[1]) for c in currents]
        current_labels = {(c[0], c[1]): f'I={c[2]}' for c in currents}
        nx.draw_networkx_edges(G, pos, edgelist=current_edges,
                               edge_color="red", width=2.5, arrowsize=20)
        nx.draw_networkx_edge_labels(
            G, pos, edge_labels=current_labels, font_size=10, font_color="red")

        # ذخیره و نمایش نمودار

        plt.savefig(filename, format='png')  # ذخیره تصویر
        plt.close()  # بستن نمودار بدون نمایش

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
    resistors_count = int(resistance)
    currents_count = int(currentGenerator)
    matrix = [[0 for _ in range(nude)] for _ in range(nude)]
    matrixR = [[0 for _ in range(nude)] for _ in range(nude)]
    matrixI = [[0] for _ in range(nude)]
    result = {}
    currentslist = []
    resistorslist = []

    for _ in range(resistors_count):
        n1, n2, Re = map(float, resistances[f"r{_+1}"].split())
        n1, n2 = int(n1) - 1, int(n2) - 1
        conductance = round(1 / Re, 6)
        resistorslist.append((n1 + 1, n2 + 1, Re))
        if (0 <= n1 < nude):
            matrixR[n1][n1] += conductance
            # کندکدانس ها را در قطر اصلی جمع میکنه
            if (0 <= n2 < nude):
                matrixR[n2][n2] += conductance
                # کندکدانس ها را در قطر اصلی جمع میکنه
                matrixR[n1][n2] -= conductance
                matrixR[n2][n1] -= conductance
                # کندکدانس های مربوط به گره های متصل را از هم کم میکن
            elif (n2 >= nude):
                result["error"] = "گره اشتباه وارد شده است"
        elif (0 <= n2 < nude):
            matrixR[n2][n2] += conductance
            # کندکدانس ها را در قطر اصلی جمع میکنه
            if (n1 >= nude):
                result["error"] = "گره اشتباه وارد شده است"
        else:
            result["error"] = "گره اشتباه وارد شده است"

    for _ in range(currents_count):
        n1, n2, Co = map(float, currents[f"i{_+1}"].split())
        n1, n2 = int(n1) - 1, int(n2) - 1
        Co = round(Co, 6)
        currentslist.append((n1 + 1, n2 + 1, Co))
        if (0 <= n1 < nude):
            matrixI[n1][0] -= Co
            if (0 <= n2 < nude):
                matrixI[n2][0] += Co
            elif (n2 >= nude):
                result["error"] = "گره اشتباه وارد شده است"
        elif (0 <= n2 < nude):
            matrixI[n2][0] += Co
            if (n1 >= nude):
                result["error"] = "گره اشتباه وارد شده است"
        else:
            result["error"] = "گره اشتباه وارد شده است"
    for i in range(nude):

        for a in range(nude):
            for b in range(nude):
                matrix[a][b] = matrixR[a][b]
        for j in range(nude):
            matrix[j][i] = matrixI[j][0]
        if (matrixR == 0 or matrix == 0):
            result["error"] = "گره اشتباه وارد شده است"
        else:
            if (type(result) == dict):
                result[f"v{i+1}"] = round(determinant(matrix) /
                                          determinant(matrixR), 6)
    draw_circuit(resistorslist, currentslist, filename="./static/circuit.png")

    return render_template('result.html', result=result,viwe=viwe)


if __name__ == "__main__":

    app.run(host="0.0.0.0", port=5000, debug=True)
