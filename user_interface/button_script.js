let button1 = $('#buttic')
let button2 = $('#buttac')
var set = 0

$('#play').on('click', function () {
    fade()
    fadeTictacButton()
    fadebutton()
    fadeText()
    fadefield()
})

function fade() {
    let el = $('#backgr')
    el.animate({
        opacity: 0,
        visibility: 'hidden'
    })

}


function fadebutton() {
    let but = $('#butt')
    but.fadeOut(800)
}

function fadeTictacButton() {
    set = 1
    button1.animate({
        top: 450
    })
    button2.animate({
        top: 450
    })
}

function fadeText() {
    let text = $('#text')
    text.animate({
        top: -750
    })
}
var resultValue = 0
function fadefield() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const gridGroup = new THREE.Group();
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    const gridSize = 3;
    const spacing = 1;

    // Рисуем сетку 3x3
    for (let i = 1; i < gridSize; i++) {
        const hPoints = [
            new THREE.Vector3(0, i * spacing, 0),
            new THREE.Vector3(gridSize * spacing, i * spacing, 0)
        ];
        const hLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(hPoints), material);
        gridGroup.add(hLine);

        const vPoints = [
            new THREE.Vector3(i * spacing, 0, 0),
            new THREE.Vector3(i * spacing, gridSize * spacing, 0)
        ];
        const vLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(vPoints), material);
        gridGroup.add(vLine);
    }

    gridGroup.position.set(-1.5, -1.5, 0);
    scene.add(gridGroup);

    const board = Array(3).fill().map(() => Array(3).fill(null));
    let currentPlayer = 'X';

    function drawX(x, y) {
        const size = 0.3;
        const line1 = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x - size, y - size, 0.01),
                new THREE.Vector3(x + size, y + size, 0.01)
            ]),
            material
        );
        const line2 = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x - size, y + size, 0.01),
                new THREE.Vector3(x + size, y - size, 0.01)
            ]),
            material
        );
        gridGroup.add(line1, line2);
    }

    function drawO(x, y) {
        const curve = new THREE.EllipseCurve(x, y, 0.35, 0.35, 0, Math.PI * 2);
        const points = curve.getPoints(64);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const circle = new THREE.Line(geometry, material);
        circle.position.z = 0.01;
        gridGroup.add(circle);
    }

    function getCellFromCoords(x, y) {
        const localX = x + 1.5;
        const localY = y + 1.5;
        const col = Math.floor(localX);
        const row = Math.floor(localY);
        if (col >= 0 && col < 3 && row >= 0 && row < 3) {
            return { row, col };
        }
        return null;
    }

    function checkWinner() {
        // Проверяем строки и столбцы
        for (let i = 0; i < 3; i++) {
            if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
                return board[i][0];
            }
            if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
                return board[0][i];
            }
        }
        // Диагонали
        if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
            return board[0][0];
        }
        if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
            return board[0][2];
        }
        // Проверка на ничью
        if (board.flat().every(cell => cell)) {
            return 'draw';
        }
        return null;
    }

    function placeFigure(row, col) {
        if (board[row][col] || winner) return;
        board[row][col] = currentPlayer;

        const x = col + 0.5;
        const y = row + 0.5;

        if (currentPlayer === 'X') {
            drawX(x, y);
            currentPlayer = 'O';
        } else {
            drawO(x, y);
            currentPlayer = 'X';
        }

        winner = checkWinner();
        if (winner) {
            if (winner === 'draw') {
                resultValue = 3;
                setTimeout(() => alert('Ничья!'), 100);
            } else if (winner === 'X') {
                resultValue = 2;
                setTimeout(() => alert(`${winner} победил!`), 100);
            } else if (winner === 'O') {
                resultValue = 1;
                setTimeout(() => alert(`${winner} победил!`), 100);
            }
            $.ajax({
                async: true,
                method: "GET",
                dataType: "json",
                url: "http://127.0.0.1:8000/winner",
                data: {'winner': resultValue},
            }).done(function (data) {
                console.log(data, set)
            });

            canClick = false; // блокируем клики после победы
        }
    }

    let canClick = false; // блокируем клики на старте
    let winner = null;

    setTimeout(() => {
        canClick = true;
    }, 1000);

    document.addEventListener('click', (event) => {
        if (!canClick || winner) return;

        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, point);

        const cell = getCellFromCoords(point.x, point.y);
        if (cell) {
            placeFigure(cell.row, cell.col);
        }
    });

    document.addEventListener('mousemove', (event) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        gridGroup.rotation.x = y * 0.5;
        gridGroup.rotation.y = x * 0.5;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

function checkandreset(){
    window.location.reload();
        $.ajax({
            async: true,
            method: "GET",
            dataType: "json",
            url: "http://127.0.0.1:8000/winner",
            data: {'winner': resultValue},
        }).done(function (data) {
            console.log(data, set)
        });
}



//.butttic {
// position: absolute;!
//     top: 45%;
//     left: 39%;
// }
// .butttac {
//     position: absolute;
//     top: 45%;
//     left: 55%;

//    let opacity = $('#opacity')
//     if (!opacity.val() || opacity.val() === 'Введите opacity') {
//         alert('Введите корректное значение opacity')
//         let resOpacity = team.opacity

