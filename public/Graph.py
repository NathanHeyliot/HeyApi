from math import *
import matplotlib.pyplot as plt
from random import *

## Graph


class Node :
    def __init__(self, ID, name, position) :
        self.ID = ID #ID chosen to simplify manipulations
        self.name = name #name given by the user
        self.position = position #2-element list that represent latitude and longitude
        self.neighbors = [] #ID tab only used for Christofides. Unneeded in the others cases because the euclidian distance between two points always exists

class Graph :
    def __init__(self, name) : 
        self.name = name
        self.nodes = [] #list of nodes
        self.hamilton = [] #hamilton path 
    
    def copy(self, name) :
        """create a new graph based on the actual one"""
        G = Graph(name)
        for n in range (len(self.nodes)):
            G.nodes.append(self.nodes[n])
        for k in range (len(self.hamilton)):
            G.hamilton.append(self.hamilton[k])
        return G
    
    def addNode(self, name, position) : 
        """add a node to a graph"""
        ID = len(self.nodes)
        for i in range (ID):
            if name == self.nodes[i].name:
                return None
        
        newNode = Node(ID, name, position)
        self.nodes.append(newNode)
        return newNode
            
    def getNode(self, ID) :
        """returns the node that corresponds to the ID given"""
        if (ID < len(self.nodes)) and (ID > 0) :
            Node = self.nodes[ID]
            return Node
        else :
            return None
    
    def distNodes(self,ID1,ID2,latlong = True) :
        """returns the distance between two nodes in meters"""
        if ID1 == ID2:
            return 0

        def distMeter(lat1, long1, lat2, long2):
            p = 0.017453292519943295     #Pi/180
            a = 0.5 - cos((lat2 - lat1) * p)/2 + cos(lat1 * p) * cos(lat2 * p) * (1 - cos((long2 - long1) * p)) / 2
            return 12742000 * asin(sqrt(a))

        node1 = self.nodes[ID1]
        node2 = self.nodes[ID2]
        
        if (latlong):
            lat1 = node1.position[0]
            long1 = node1.position[1]
            
            lat2 = node2.position[0]
            long2 = node2.position[1]
            return distMeter(lat1, long1, lat2, long2)
        
        def DistEucl(pos1,pos2):
            return sqrt((pos1[0]-pos2[0])**2 + (pos1[1]-pos2[1])**2)
            
        return DistEucl(node1.position, node2.position)

            
            
    def show(self, drawedge = True, save = False, tree = False):        
        """ shows the graph 
            save the figure if the boolean save is true"""
        def InitFig():
            """initialize the figure"""
            ax = plt.gca()
            ax.cla()
            plt.axis('on') #hide or show the axes
        
        def Corrected(position):
            """swap the latitude and the longitude"""
            X = position[1]
            Y = position[0]
            return [X,Y]
            
        def DrawEdge(node1,node2, color, width):
            """draw an edge ..... thanks captain obvious"""
            if (node1.ID != node2.ID):
                coordstart = Corrected(node1.position)
                coordstop = Corrected(node2.position)
                plt.plot([coordstart[0],coordstop[0]], [coordstart[1],coordstop[1]], linewidth = width, color=color)
            
        def DrawNode(node, color, width):
            """draw a node"""
            newCoord = Corrected(node.position)
            
            circle = plt.Circle((newCoord[0],newCoord[1]), width, color=color,fill=True) # vérifier les 3 lignes qui suivent un jour
            fig = plt.gcf()
            fig.gca().add_artist(circle)
            
        def SaveFigure(save):
            """save the figure if the boolean save is true"""
            if save:
                plt.show()
                plt.savefig(self.name, dpi=1000)
            else:
                plt.show()
        
        
        InitFig()
        
        # edge drawing
        if (drawedge):
            for n1 in self.nodes:
                for n2 in self.nodes:
                    DrawEdge(n1, n2, color='blue', width = 0.4)
            
        # node drawing
        for node in self.nodes :
            DrawNode(node, color='black', width = 0.001)
            
        # hamilton path drawing
        n = len(self.hamilton)
        for i in range (n-1):
            DrawEdge(self.hamilton[i], self.hamilton[i+1], color='red', width = 1)
            if (i == n-2):
                DrawEdge(self.hamilton[i+1], self.hamilton[0], color='red', width = 1)
        
        # Save figure in file
        SaveFigure(save)
        
    
    
    def buildRandomGraph(self, nbrNodes):
        """builds a graph with nbrNodes nodes placed randomly"""
        
        for i in range (nbrNodes) :
            #node creation
            x = randint(-100,100)
            y = randint(-100,100)
            ID = i
            self.addNode(ID, [x,y])
        
    
    def printf(self):
        for node in self.nodes:
            print("(ID: " + str(node.ID) + ", name: " + str(node.name) , end='')
            print(", position: [" + str(node.position[0]) + "," + str(node.position[0]) + "])")
        
        


## Tests

if __name__ == '__main__':

    graph_test = Graph("graph_test")  
    
    
    # Tests de distNodes
    
    def TestDistNodes(graph_test):
        print("Test distNodes : Passed\n")
        
        guipry = Node(0,0,[47.824808,-1.841681])
        stjacques = Node(1,1,[48.094112,-1.704677])
        graph_test.nodes.append(guipry)
        graph_test.nodes.append(stjacques)
        print("Distance entre les points Guipry(47.824808,-1.841681) et St-Jacques(48.094112,-1.704677)")
        print("Résultat de notre fonction : " + str(graph_test.distNodes(0,1)) + " m")
        print("Résultat Google : 31.64 km \n")
        
        gare = Node(2,2,[48.103840, -1.671936])
        gaumont = Node(3,3,[48.106134, -1.675628])
        graph_test.nodes.append(gare)
        graph_test.nodes.append(gaumont)
        print("Distance entre les points Gaumont(48.106134, -1.675628) et Gare(48.103840, -1.671936)")
        print("Résultat de notre fonction : " + str(graph_test.distNodes(2,3)) + " m")
        print("Résultat Google : 380,37 m \n")

        graph_test.hamilton.append(guipry)
        graph_test.hamilton.append(stjacques)
    
    
    # Test Copy
    
    def TestCopy(graph_test):
        print("Test copy : ", end='')
        graph_copy = graph_test.copy("graph_copy")
        for k in range (len(graph_test.nodes)):
            if graph_copy.nodes[k].ID != graph_test.nodes[k].ID:
                print("Failed")
                return False
            if graph_copy.nodes[k].name != graph_test.nodes[k].name:
                print("Failed")
                return False
            if graph_copy.nodes[k].position[0] != graph_test.nodes[k].position[0]:
                print("Failed")
                return False
            if graph_copy.nodes[k].position[1] != graph_test.nodes[k].position[1]:
                print("Failed")
                return False
        
        for i in range (len(graph_test.hamilton)):
            if graph_copy.hamilton[i].ID != graph_test.hamilton[i].ID:
                print("Failed")
                return False
            if graph_copy.hamilton[i].name != graph_test.hamilton[i].name:
                print("Failed")
                return False
            if graph_copy.hamilton[i].position[0] != graph_test.hamilton[i].position[0]:
                print("Failed")
                return False
            if graph_copy.hamilton[i].position[1] != graph_test.hamilton[i].position[1]:
                print("Failed")
                return False
        print("Passed")
        return True
    
    
    # Test addNode
    
    def TestAddNode(graph_test):
        print("Test addNode : ", end='')
        graph_test.addNode(4,[48.206164, -1.731666])
        if (graph_test.nodes[4].name != 4) or (graph_test.nodes[4].ID != 4) or (graph_test.nodes[4].position[0] != 48.206164) or (graph_test.nodes[4].position[1] != -1.731666):
            print("Failed")
            return False
        if graph_test.addNode(4,[48.206164, -1.731666]) != None :
            print("Failed")
            return False
        print("Passed")
        return True
    
    
    # Test getNode
    
    def TestGetNode(graph_test):
        print("Test getNode : ", end='')
        node = graph_test.getNode(-1)
        if node != None:
            print("Failed")
            return False
        node = graph_test.getNode(5)
        if node != None:
            print("Failed")
            return False
        node = graph_test.getNode(4)
        if (node.name != 4) or (node.ID != 4) or (node.position[0] != 48.206164) or (node.position[1] != -1.731666):
            print("Failed")
            return False
        print("Passed")
        return True
    
    
    # Test show
    
    def TestShow():
        graph_test.show()
    
    
    # Test BuildRandomGraph
    
    def TestBuildRandomGraph():
        RandGraph = Graph("RandGraph")
        RandGraph.buildRandomGraph(20)
        RandGraph.show()
        
        
    # Test Print
    
    def TestPrint():
        RandGraph = Graph("RandGraph")
        RandGraph.buildRandomGraph(20)
        RandGraph.printf()
        
        
    # Tests Calls

    def TestsGraph():
        TestDistNodes(graph_test)
        TestCopy(graph_test)
        TestAddNode(graph_test)
        TestGetNode(graph_test)
        #TestShow()
        #TestBuildRandomGraph()
        #TestPrint()
        
    
    TestsGraph()