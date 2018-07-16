from Graph import *
from itertools import *
from time import *

## Hamilton path algorithms

def Brutal(G, latlong = True):
    """return the hamilton path and it's cost by comparing EVERY possibilities"""
    n =  len(G.nodes)
    MinPath = G.nodes
    MinCost = 0
    for k in range (n-1):
        MinCost += G.distNodes(G.nodes[k].ID, G.nodes[k+1].ID, latlong)
        if (k == n-2):
            MinCost += G.distNodes(G.nodes[k+1].ID, G.nodes[0].ID, latlong)
            
    for path in list(permutations(G.nodes)):
        cost = 0
        k = 0
        test = True
        while (k<n-1) and (test):
            cost += G.distNodes(path[k].ID, path[k+1].ID, latlong)
            if (k == n-2):
                cost += G.distNodes(path[k+1].ID, path[0].ID, latlong)
            if (cost > MinCost):
                test = False
            k += 1
        if (cost < MinCost):
            MinCost = cost
            MinPath = list(path)
        
    return [MinCost, MinPath]
    
    
def Inser(G, latlong = True):
    """return an aproximated path that has been constructed by insertion of nodes"""
    stack = G.nodes.copy()
    shuffle(stack)
    n =  len(G.nodes)
    if (n < 2):
        return [0, G.nodes]
    if (n == 2):
        return [2 * G.distNodes(G.nodes[0].ID, G.nodes[1].ID, latlong), G.nodes]
    path = [stack.pop(),stack.pop()]
    while (stack):
        node = stack.pop()
        m = len(path)
        indexInser = m
        MinDetour = G.distNodes(path[-1].ID, node.ID, latlong) + G.distNodes(node.ID, path[0].ID, latlong) - G.distNodes(path[-1].ID, path[0].ID, latlong)
        for k in range (m-1):
            detour = G.distNodes(path[k].ID, node.ID, latlong) + G.distNodes(node.ID, path[k+1].ID, latlong) - G.distNodes(path[k].ID, path[k+1].ID, latlong)
            if (detour < MinDetour):
                MinDetour = detour
                indexInser = k + 1
        path.insert(indexInser,node)
        
    cost = 0
    for k in range (n-1):
        cost += G.distNodes(path[k].ID, path[k+1].ID, latlong)
        if (k == n-2):
            cost += G.distNodes(path[k+1].ID, path[0].ID, latlong)
            
    return [cost, path]
    
    

def Nearest(G, latlong = True):
    """return an aproximated path that has been constructed by adding the nearest neighbor at each step"""
    list = G.nodes.copy()
    shuffle(list)
    n =  len(G.nodes)
    cost = 0
    if (n < 2):
        return [0, G.nodes]
    if (n == 2):
        return [2 * G.distNodes(G.nodes[0].ID, G.nodes[1].ID, latlong), G.nodes]
    
    path = [list.pop()]
    while (list):
        m = len(list)
        Nearest = 0
        MinDist = G.distNodes(path[-1].ID, list[0].ID, latlong)
        for k in range (m):
            dist = G.distNodes(path[-1].ID, list[k].ID, latlong)
            if (dist < MinDist):
                MinDist = dist
                Nearest = k
        path.append(list.pop(Nearest))
        cost += MinDist
    cost += G.distNodes(path[-1].ID, path[0].ID, latlong)
    
    return [cost, path]

    

def H2opt(G, Hamilton, latlong = True):
    def Swap2opt(path, k, l):
        if (l == 0):
            middle = path[k+2 :]
            middle.reverse()
            path = path[k+1] + path[1 : k+1] + path[0] + middle
            return path
        middle = path[k+1 : l+1]
        middle.reverse()
        path = path[: k+1] + middle + path[l+1 :]
        return path
        
    n = len(Hamilton)
    z = 0
    comp = 0
    limit = 100
    better = True
    while (better) and (z < limit):
        z += 1
        better = False
        for i in range (n):
            for j in range(n):
                if (j < i-1) or (j > i+1):
                    k = min(i, j)
                    l = max(i, j)
                    
                    a = k
                    b = k+1
                    c = l
                    d = l+1
                    if (l == n-1):
                        d = 0

                    if (G.distNodes(Hamilton[a].ID, Hamilton[b].ID , latlong) + G.distNodes(Hamilton[c].ID, Hamilton[d].ID , latlong) > G.distNodes(Hamilton[a].ID, Hamilton[c].ID , latlong) + G.distNodes(Hamilton[b].ID, Hamilton[d].ID , latlong)):
                        Hamilton = Swap2opt(Hamilton, k, l)
                        better = True
                        comp +=1
                        
    cost = 0
    for k in range (n-1):
        cost += G.distNodes(Hamilton[k].ID, Hamilton[k+1].ID, latlong)
        if (k == n-2):
            cost += G.distNodes(Hamilton[k+1].ID, Hamilton[0].ID, latlong)
            
    return [cost, Hamilton]
    


    
    
def Prim (G, latlong=True): #maybe optimize
    def inp(y, P):
        n = len(P)
        for k in range (n):
            if (y == P[k]):
                return True
        return False
        
    def infto(x, y):
        if (x == -1):
            return False
        if (y == -1):
            return True
        return (x < y)
            
    
    def extracter(P, Key):
        n = len(P)
        indexmin = 0
        min = Key[P[0]]
        for i in range (n):
            if (infto(Key[P[i]], min)):
                min = Key[P[i]]
                indexmin = i
        ret = P[indexmin]
        del P[indexmin]
        return ret
    
    n = len(G.nodes)
    Key = [-1 for k in range (n)]
    Father = [-1 for k in range (n)]
    P = [k for k in range (n)]
    Key[0] = 0
    Father[0] = 0
    while (P):
        x = extracter(P, Key)
        for y in range (n):
            if (y != x) and inp(y, P) and infto(G.distNodes(x, y, latlong), Key[y]):
                Key[y] = G.distNodes(x, y, latlong)
                Father[y] = x
    return Father


    
def Christofides(G, latlong = True):
    n = len(G.nodes)
    
    #ACM obtained with Prim algorithm
    tree  = Prim(G, latlong)
    
    #deg of the tree
    deg = [1 for k in range (n)]
    deg[0] = -1
    for k in range (n):
        deg[tree[k]] += 1
    #print (deg)
        
    
    

## Tests

if __name__ == '__main__':
    
    
    Rand = Graph("rand")   
    Rand.buildRandomGraph(100)
    
    def TestBrutal():
        c = Brutal(Rand, False)
        Rand.hamilton = c[1]
        Rand.show(False)
    
    
    def TestInser():
        c = Inser(Rand, False)
        Rand.hamilton = c[1]
        Rand.show(False)
        
    def TestNearest():
        c = Nearest(Rand, False)
        Rand.hamilton = c[1]
        Rand.show(False)
        
    def Test2opt():
        c = H2opt(Rand, Inser(Rand, False)[1], False)
        Rand.hamilton = c[1]
        Rand.show(False)
        
    def plotPrim(G):
        tree = Prim(G, False)
        n = len(tree)
        
        def Correcter(position):
            """swap the latitude and the longitude"""
            X = position[1]
            Y = position[0]
            return [X,Y]
            
        def DrawBranch(node1,node2, color, width):
            """draw a branch of the tree"""
            if (node1.ID != node2.ID):
                coordstart = Correcter(node1.position)
                coordstop = Correcter(node2.position)
                plt.plot([coordstart[0],coordstop[0]], [coordstart[1],coordstop[1]], linewidth = width, color=color)
        
        for k in range (n):
            DrawBranch(G.nodes[tree[k]], G.nodes[k], color='red', width=1)
        
        plt.show()
        
    def TestPrim():
        plotPrim(Rand)
        Christofides(Rand, False)
        
    
    def PerfGraphics(nbrNodes, nbtest = 100):
        """Calculates the average time of calculation of the hamilton path and it's length and draws curves.
        It will test graphs from one node to nbrNodes nodes.
        For each number of node the test his repeated nbtest times to obtain an average."""
        Nodes = []
        
        #Brutal
        ATbrutal = []
        ADbrutal = []
        
        #Inser
        ATinser = []
        ADinser = []
        
        #Nearest
        ATnearest = []
        ADnearest = []
        
        #2opt
        AT2opt = []
        AD2opt = []
        
        #2opt + Inser
        AT2optI = []
        AD2optI = []
        
        #2opt + Nearest
        AT2optN = []
        AD2optN = []
        
        
        for n in range (2, nbrNodes+1):
            Nodes.append(n)
            print(n)
            
            # Average Time and Average Distance for every algorithms
            
            tbrutal = 0
            dbrutal = 0
            
            tinser = 0
            dinser = 0
            
            tnearest = 0
            dnearest = 0
            
            t2opt = 0
            d2opt = 0
            
            t2optI = 0
            d2optI = 0
            
            t2optN = 0
            d2optN = 0
            
            for k in range (nbtest):
                Rand = Graph("rand")   
                Rand.buildRandomGraph(n)
                
                #Brutal
                if (n < 8): #too long
                    av = time()
                    brutal = Brutal(Rand, False)
                    ap = time()
                    tbrutal += ap-av
                    dbrutal += brutal[0]
                
                #Inser
                av = time()
                inser = Inser(Rand, False)
                ap = time()
                tinser += ap-av
                dinser += inser[0]
                
                #Nearest
                av = time()
                nearest = Nearest(Rand, False)
                ap = time()
                tnearest += ap-av
                dnearest += nearest[0]
                
                #2opt
                av = time()
                h2opt = H2opt(Rand, Rand.nodes, False)
                ap = time()
                t2opt += ap-av
                d2opt += h2opt[0]
                
                #2opt + Inser
                av = time()
                h2optI = H2opt(Rand, Inser(Rand, False)[1], False)
                ap = time()
                t2optI += ap-av
                d2optI += h2optI[0]
                
                #2opt + Nearest
                av = time()
                h2optN = H2opt(Rand, Nearest(Rand, False)[1], False)
                ap = time()
                t2optN += ap-av
                d2optN += h2optN[0]
                
            
            #Brutal
            if (n < 8):    
                ATbrutal.append(tbrutal/nbtest)
                ADbrutal.append(dbrutal/nbtest)
            
            #Inser
            ATinser.append(tinser/nbtest)
            ADinser.append(dinser/nbtest)
            
            #Nearest
            ATnearest.append(tnearest/nbtest)
            ADnearest.append(dnearest/nbtest)
            
            #2opt
            AT2opt.append(t2opt/nbtest)
            AD2opt.append(d2opt/nbtest)
            
            #2opt + Inser
            AT2optI.append(t2optI/nbtest)
            AD2optI.append(d2optI/nbtest)
            
            #2opt + Nearest
            AT2optN.append(t2optN/nbtest)
            AD2optN.append(d2optN/nbtest)
            
            
        
        plt.subplot(211)
        plt.yscale('log')
        plt.plot(Nodes[: len(ATbrutal)], ATbrutal, label='Brutal')
        plt.plot(Nodes,ATinser, label='Inser')
        plt.plot(Nodes,ATnearest, label='Nearest')
        plt.plot(Nodes,AT2opt, label='2opt')
        plt.plot(Nodes,AT2optI, label='2opt + Inser')
        plt.plot(Nodes,AT2optN, label='2opt + Nearest')
        plt.xlabel('Number of Nodes')
        plt.ylabel('Time (in seconds)')
        plt.legend()
        plt.title('Average time to find an hamilton path for each algorithm')
                
        
        plt.subplot(212)
        plt.plot(Nodes[: len(ADbrutal)], ADbrutal, label='Brutal')
        plt.plot(Nodes,ADinser, label='Inser')
        plt.plot(Nodes,ADnearest, label='Nearest')
        plt.plot(Nodes,AD2opt, label='2opt')
        plt.plot(Nodes,AD2optI, label='2opt + Inser')
        plt.plot(Nodes,AD2optN, label='2opt + Nearest')
        plt.xlabel('Number of Nodes')
        plt.ylabel('Length (in meters)')
        plt.legend()
        plt.title('Average length of an hamilton path for each algorithm')
        plt.savefig("Graphique de performance : (" + str(nbrNodes) + ", " + str(nbtest) + ")")
        plt.show()
        
    
    
    def TestsHamilton():
        #TestBrutal()
        #TestInser()
        #TestNearest()
        #Test2opt()
        TestPrim()
        #PerfGraphics(50,1000) #extremely long if the values are over (60,10)
        c = 1
        
    TestsHamilton()