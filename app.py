import matplotlib.pyplot as plt
import networkx as nx
from flask import Flask, request, render_template
from flask_cors import CORS
import matplotlib
matplotlib.use('Agg')


app = Flask(__name__, template_folder="temp")
CORS(app)


@app.after_request
def add_cors_headers(response):
    if request.path.startswith('/static/'):
        response.headers['Access-Control-Allow-Origin'] = '*'
    return response


@app.route('/')
def index():
    return render_template("index.html")


viwe = 0


@app.route('/final-submit', methods=['POST'])
def final_submit():
    global viwe
    viwe += 1
    nodes = request.form.get("nodes")
    resistance = request.form.get("resistance")
    currentGenerator = request.form.get("currentGenerator")
    resistances = {k: v for k, v in request.form.items() if k.startswith("r")}
    currents = {k: v for k, v in request.form.items() if k.startswith("i")}

    def draw_circuit(resistors, currents, filename="circuit.png"):
        # ایجاد گراف‌ها
        G = nx.DiGraph()
        Y = nx.Graph()
        G_all = nx.Graph()
        for r in resistors:
            Y.add_edge(r[0], r[1], resistance=r[2])
            G_all.add_edge(r[0], r[1])
        for c in currents:
            G.add_edge(c[0], c[1], current=c[2])
            G_all.add_edge(c[0], c[1])
        pos = nx.spring_layout(G_all)
        edge_labels = {(r[0], r[1]): f'R={r[2]}' for r in resistors}
        nx.draw(Y, pos, with_labels=True, node_color="lightblue",
                edge_color="black", width=1.5, connectionstyle="arc3,rad=0.1")
        nx.draw_networkx_edge_labels(
            Y, pos, edge_labels=edge_labels, font_size=10, font_color="black", label_pos=0.6, rotate=True)

        current_labels = {(c[0], c[1]): f'I={c[2]}' for c in currents}
        current_edge_labels = {}
        for edge in current_labels:
            node1, node2 = edge
            x_pos = (pos[node1][0] + pos[node2][0]) / 2
            y_pos = (pos[node1][1] + pos[node2][1]) / 2
            current_edge_labels[edge] = (
                x_pos + -0.1, y_pos + -0.1)

        nx.draw_networkx_edge_labels(
            G, pos, edge_labels=current_labels, font_size=10, font_color="red",
            label_pos=0.5, bbox=dict(facecolor='white', edgecolor='none', alpha=0.7))
        current_edges = [(c[0], c[1]) for c in currents]
        nx.draw_networkx_edges(G, pos, edgelist=current_edges,
                               edge_color="red", width=2.5, arrowsize=20,
                               connectionstyle="arc3,rad=0.2")
        plt.savefig(filename, format='png')
        plt.close()

    def determinant(matrix):
        if len(matrix) == 1:
            return matrix[0][0]
        if len(matrix) == 2:
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
        det = 0
        for col in range(len(matrix)):
            sub_matrix = [row[:col] + row[col+1:] for row in matrix[1:]]
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
        if (Re == 0):
            result["error"] = "اتصال کوتاه مقدار مقاومت صفر وارد شده است"
            continue
        elif (n1 == n2):
            result["error"] = "گره اشتباه وارد شده است"
        conductance = round(1 / Re, 6)
        resistorslist.append((n1 + 1, n2 + 1, Re))
        if (0 <= n1 < nude):
            matrixR[n1][n1] += conductance
            if (0 <= n2 < nude):
                matrixR[n2][n2] += conductance
                matrixR[n1][n2] -= conductance
                matrixR[n2][n1] -= conductance
            elif (n2 >= nude):
                result["error"] = "گره اشتباه وارد شده است"
        elif (0 <= n2 < nude):
            matrixR[n2][n2] += conductance
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
    detr = determinant(matrixR)
    for i in range(nude):

        for a in range(nude):
            for b in range(nude):
                matrix[a][b] = matrixR[a][b]
        for j in range(nude):
            matrix[j][i] = matrixI[j][0]
        detm = determinant(matrix)
        if (detm == 0 or detr == 0):
            if (detm == 0):
                result[f"v{i+1}"] = 0
            else:
                result["error"] = "مدار مشکل دارد"
                break
        else:
            if (type(result) == dict):
                result[f"v{i+1}"] = round(detm / detr, 6)

    draw_circuit(resistorslist, currentslist, filename="./static/circuit.png")
    return render_template('result.html', result=result, viwe=viwe)


if __name__ == "__main__":

    app.run(host="0.0.0.0", port=80)
